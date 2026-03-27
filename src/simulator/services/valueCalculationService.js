import { getBenchmark } from '../data/industryBenchmarks';
import hiddenIssueMap from '../data/hiddenIssueMap';

// ─── Formatters ───────────────────────────────────────────────────────────────

export const formatLakhs = (amount) => {
    if (!amount || isNaN(amount)) return '0';
    if (amount >= 10_000_000) return (amount / 10_000_000).toFixed(1) + ' Cr';
    if (amount >= 100_000) return (amount / 100_000).toFixed(1) + 'L';
    return Math.round(amount).toLocaleString('en-IN');
};

export const formatINR = (amount) => {
    if (!amount || isNaN(amount)) return '₹0';
    return '₹' + formatLakhs(amount);
};

// ─── Org size parser ──────────────────────────────────────────────────────────

const parseOrgSize = (sizeString) => {
    const map = {
        '100–500 employees': 300,
        '500–2,000 employees': 1250,
        '2,000–10,000 employees': 6000,
        '10,000+ employees': 15000
    };
    return map[sizeString] || 1000;
};

// ─── Per-department use-case pain calculator ──────────────────────────────────

const calculateUseCasePain = (useCase, rates, bench, orgSize) => {
    const dept = useCase.department || 'default';

    switch (dept) {
        case 'HR': {
            const attritionRate = bench.clinicalTurnoverPct || 18;
            const headcount = parseOrgSize(orgSize);
            const costPerHire = rates.costPerHire || bench.attritionCostPerHire || 120000;
            const avgSalary = rates.avgMonthlySalary || Math.round(costPerHire / 3);
            const annualAttritions = Math.round(headcount * attritionRate / 100);
            const replacementCost = annualAttritions * costPerHire;
            const productivityLoss = annualAttritions * avgSalary * 3;
            const hrFTE = rates.hrFTECount || 8;
            const hrProcessCost = hrFTE * (rates.avgMonthlySalary || 75000) * 12 * 0.35;
            const annualCost = replacementCost + productivityLoss + hrProcessCost;
            return {
                annualCost,
                formula: `${annualAttritions} replacements × ${formatINR(costPerHire)}/hire + ${formatINR(productivityLoss)} productivity loss + ${formatINR(hrProcessCost)} process cost`,
                assumptions: [
                    `${attritionRate}% annual attrition rate`,
                    `${formatINR(costPerHire)} cost per hire`,
                    `3 months productivity loss per replacement`,
                    `35% of HR capacity on manual tasks`
                ]
            };
        }

        case 'Finance': {
            const closeDays = bench.financeCloseDays || 7;
            const teamSize = rates.financeTeamSize || 6;
            const avgSalary = rates.avgFinanceSalary || 90000;
            const dailyCost = avgSalary / 22;
            const closeProcessCost = closeDays * teamSize * dailyCost * 12;
            const annualRevenue = rates.annualRevenue ? rates.annualRevenue * 10_000_000 : 0;
            const varianceCost = annualRevenue * 0.03;
            const annualCost = closeProcessCost + varianceCost;
            return {
                annualCost,
                formula: `${closeDays} days × ${teamSize} staff × ${formatINR(Math.round(dailyCost))}/day × 12 months + ${formatINR(varianceCost)} variance impact`,
                assumptions: [
                    `${closeDays}-day month-end close cycle`,
                    `${teamSize} finance staff`,
                    `3% revenue at risk from late variance detection`
                ]
            };
        }

        case 'Operations': {
            const slaBreachRate = bench.slaBreachRate || 12;
            const monthlyTickets = rates.ticketVolumeMonthly || 300;
            const breachCost = rates.slaBreachPenalty || 20000;
            const monthlyBreaches = Math.round(monthlyTickets * slaBreachRate / 100);
            const annualBreachCost = monthlyBreaches * breachCost * 12;
            const hourlyRate = rates.avgHourlyRate || 600;
            const wastedHours = bench.automationROI?.hoursSavedMonthly || 120;
            const processWasteCost = wastedHours * hourlyRate * 12;
            const annualCost = annualBreachCost + processWasteCost;
            return {
                annualCost,
                formula: `${monthlyBreaches} SLA breaches/month × ${formatINR(breachCost)} × 12 + ${formatINR(processWasteCost)} process waste`,
                assumptions: [
                    `${slaBreachRate}% SLA breach rate`,
                    `${formatINR(breachCost)} average breach cost`,
                    `${wastedHours} hours/month in manual processes`
                ]
            };
        }

        case 'IT': {
            const monthlyTickets = rates.ticketVolumeMonthly || 300;
            const resolutionTime = rates.avgResolutionTime || 4.5;
            const hourlyRate = rates.avgHourlyRate || 700;
            const automatableTickets = monthlyTickets * 0.4;
            const annualWastedHours = automatableTickets * resolutionTime * 12;
            const annualCost = annualWastedHours * hourlyRate;
            return {
                annualCost,
                formula: `${Math.round(automatableTickets)} automatable tickets/month × ${resolutionTime}h × ${formatINR(hourlyRate)}/hr × 12`,
                assumptions: [
                    `40% of tickets are automatable`,
                    `${resolutionTime} hours average resolution`,
                    `${formatINR(hourlyRate)}/hour loaded staff cost`
                ]
            };
        }

        case 'Sales': {
            const dealSize = rates.avgDealSize ? rates.avgDealSize * 100_000 : 3_500_000;
            const cycleWeeks = rates.salesCycleWeeks || 12;
            const leakagePct = 0.15;
            const annualCost = dealSize * (52 / cycleWeeks) * leakagePct;
            return {
                annualCost,
                formula: `Pipeline leakage: ${leakagePct * 100}% of ${formatINR(dealSize)} avg deal × ${Math.round(52 / cycleWeeks)} cycles/year`,
                assumptions: [
                    `${formatINR(dealSize)} average deal value`,
                    `${cycleWeeks}-week sales cycle`,
                    `15% pipeline leakage rate`
                ]
            };
        }

        case 'Strategy':
        case 'Corporate Strategy':
        case 'Business Development':
        case 'BD':
        case 'Growth':
        case 'Partnerships': {
            // Cost = manual research waste + addressable missed revenue opportunity
            const bdTeamSize = rates.bdTeamSize || 5;
            const avgSalary = rates.avgMonthlySalary || 150000;
            const manualResearchWaste = bdTeamSize * avgSalary * 12 * 0.45;
            const avgDealValue = rates.avgDealSize ? rates.avgDealSize * 100_000 : 8_000_000;
            const missedDealsPerYear = rates.missedDeals || 10;
            const captureRateImprovement = 0.25;
            const missedRevenue = avgDealValue * missedDealsPerYear * captureRateImprovement;
            const annualCost = manualResearchWaste + missedRevenue;
            return {
                annualCost,
                formula: `${bdTeamSize} BD analysts × ${formatINR(avgSalary)}/month × 45% research waste + ${formatINR(missedRevenue)} addressable missed opportunity`,
                assumptions: [
                    `45% of BD team time on manual research and intelligence gathering`,
                    `${missedDealsPerYear} qualified prospects missed per year without live signals`,
                    `25% incremental capture rate improvement with AI-driven intelligence`
                ]
            };
        }

        case 'Market Intelligence':
        case 'Market Entry':
        case 'GCC':
        case 'International': {
            const analystTeamSize = rates.analystTeamSize || 4;
            const avgSalary = rates.avgMonthlySalary || 160000;
            const researchWaste = analystTeamSize * avgSalary * 12 * 0.60;
            const marketSize = rates.targetMarketRevenue ? rates.targetMarketRevenue * 10_000_000 : 50_000_000;
            const penetrationDelta = 0.04;
            const missedRevenue = marketSize * penetrationDelta;
            const annualCost = researchWaste + missedRevenue;
            return {
                annualCost,
                formula: `${analystTeamSize} analysts × ${formatINR(avgSalary)}/month × 60% manual research + ${formatINR(missedRevenue)} market penetration gap`,
                assumptions: [
                    `60% analyst time on manual intelligence gathering`,
                    `4% addressable market penetration improvement with live intelligence`,
                    `Target market revenue base used for opportunity sizing`
                ]
            };
        }

        default: {
            const headcount = parseOrgSize(orgSize);
            const avgSalary = rates.avgMonthlySalary || 70000;
            const annualCost = headcount * avgSalary * 12 * 0.25 * 0.1;
            return {
                annualCost,
                formula: 'Based on industry-average process waste model',
                assumptions: ['25% process waste rate', '10% of headcount affected']
            };
        }
    }
};

// ─── FEATURE 3: Main calculation engine ──────────────────────────────────────

export const calculateCurrentAnnualPain = (useCases, rateInputs, industry, orgSize) => {
    const bench = getBenchmark(industry);
    const rates = rateInputs || {};
    let total = 0;
    const breakdown = [];

    for (const useCase of useCases) {
        const pain = calculateUseCasePain(useCase, rates, bench, orgSize);
        total += pain.annualCost;
        breakdown.push({
            useCaseName: useCase.challenge,
            department: useCase.department,
            annualCost: pain.annualCost,
            calculation: pain.formula,
            assumptions: pain.assumptions
        });
    }

    return { total, breakdown, currency: 'INR' };
};

const recoveryRates = {
    HR: 0.72, Finance: 0.68, Operations: 0.61, IT: 0.79, Sales: 0.54,
    Strategy: 0.68, 'Corporate Strategy': 0.68, 'Business Development': 0.68,
    BD: 0.68, Growth: 0.68, Partnerships: 0.68,
    'Market Intelligence': 0.72, 'Market Entry': 0.72, GCC: 0.72, International: 0.72,
    default: 0.58
};
const TYPICAL_ANNUAL_CONTRACT = 2_700_000; // ₹27L

export const calculatePostPithonixResidual = (currentPain) => {
    let totalRecoverable = 0;
    const breakdown = [];

    for (const item of currentPain.breakdown) {
        const rate = recoveryRates[item.department] || recoveryRates.default;
        const recoverable = item.annualCost * rate;
        const residual = item.annualCost - recoverable;
        totalRecoverable += recoverable;
        breakdown.push({ ...item, recoveryRate: rate, recoverableValue: recoverable, residualCost: residual });
    }

    return {
        totalRecoverable,
        residual: currentPain.total - totalRecoverable,
        breakdown,
        roiMultiple: totalRecoverable > 0 ? parseFloat((totalRecoverable / TYPICAL_ANNUAL_CONTRACT).toFixed(1)) : 0
    };
};

export const calculatePaybackWeeks = (recoverableValue, contractValue = TYPICAL_ANNUAL_CONTRACT) => {
    if (!recoverableValue || recoverableValue <= 0) return null;
    const weeklyRecovery = recoverableValue / 52;
    return Math.round(contractValue / weeklyRecovery);
};

export const runValueCalculations = (simState) => {
    const { useCases = [], valueInputs = {}, industry, size } = simState;
    const rateInputs = valueInputs.rateInputs || {};

    if (!useCases.length) return null;

    const currentAnnualPain = calculateCurrentAnnualPain(useCases, rateInputs, industry, size);
    const postPithonixResidual = calculatePostPithonixResidual(currentAnnualPain);
    const paybackWeeks = calculatePaybackWeeks(postPithonixResidual.totalRecoverable);

    return {
        currentAnnualPain,
        postPithonixResidual,
        recoverableValue: postPithonixResidual.totalRecoverable,
        paybackWeeks,
        roiMultiple: postPithonixResidual.roiMultiple,
        breakdown: postPithonixResidual.breakdown
    };
};

// ─── FEATURE 4: Hidden issue detection ───────────────────────────────────────

export const detectHiddenIssues = (useCases) => {
    if (!useCases || useCases.length === 0) return [];

    const confirmedDepts = useCases.map(uc => uc.department);
    const confirmedKeywords = useCases.flatMap(uc =>
        (uc.challenge || '').toLowerCase().split(/\s+/)
    );

    const detected = [];

    for (const issue of hiddenIssueMap) {
        const deptMatch = confirmedDepts.includes(issue.triggerDepartment);
        const keywordMatch = issue.triggerKeywords.some(kw =>
            confirmedKeywords.some(w => w.includes(kw))
        );

        if (deptMatch && keywordMatch) {
            const alreadyKnown = confirmedDepts.some(d =>
                issue.hiddenIssue.relatedDepartment.includes(d)
            );

            if (!alreadyKnown) {
                const relatedUseCase = useCases.find(uc =>
                    confirmedDepts.includes(issue.triggerDepartment)
                );
                detected.push({
                    ...issue.hiddenIssue,
                    id: issue.id,
                    relatedToUseCase: relatedUseCase?.challenge || ''
                });
            }
        }
    }

    return detected
        .sort((a, b) => b.confidenceLevel - a.confidenceLevel)
        .slice(0, 3);
};

// ─── Currency conversion helper ───────────────────────────────────────────────

export const convertToINR = (amount, currency, unit) => {
    if (!amount) return 0;
    const num = parseFloat(amount) || 0;

    const unitMultiplier = {
        'Thousands': 1_000,
        'Lakhs': 100_000,
        'Crores': 10_000_000
    };

    const fxRate = {
        '₹': 1,
        '$': 83.5,
        'AED': 22.7,
        'SAR': 22.3
    };

    return num * (unitMultiplier[unit] || 1) * (fxRate[currency] || 1);
};
