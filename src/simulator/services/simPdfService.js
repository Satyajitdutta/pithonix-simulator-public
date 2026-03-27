// Color mapping: dark theme → light theme for PDF export
const DARK_TO_LIGHT = [
    ['#0b0c10', '#ffffff'],
    ['#1f2833', '#f8fafc'],
    ['#2a3340', '#e2e8f0'],
    ['#1a1d27', '#f1f5f9'],
    ['rgb(11, 12, 16)', '#ffffff'],
    ['rgb(31, 40, 51)', '#f8fafc'],
    ['rgb(42, 51, 64)', '#e2e8f0'],
];
const TEXT_LIGHT = ['#f0f5f9', '#c5c6c7', 'rgb(240, 245, 249)', 'rgb(197, 198, 199)'];
const TEXT_MED = ['#8b8c8d', 'rgb(139, 140, 141)'];
const CYAN = ['#66fcf1', 'rgb(102, 252, 241)'];
const ORANGE = ['#e8623a', 'rgb(232, 98, 58)'];
const BORDER_DARK = ['rgba(102, 252, 241, 0.12)', 'rgba(102,252,241,0.12)', 'rgba(102, 252, 241, 0.15)', 'rgba(102,252,241,0.15)', 'rgba(102, 252, 241, 0.25)', 'rgba(102,252,241,0.25)'];

function lightenClone(clone) {
    const allEls = clone.querySelectorAll('*');
    allEls.forEach(el => {
        const cs = window.getComputedStyle(el);

        // Background
        const bg = cs.backgroundColor;
        const bgMatch = DARK_TO_LIGHT.find(([dark]) => bg === dark || bg.replace(/\s/g, '') === dark.replace(/\s/g, ''));
        if (bgMatch) el.style.backgroundColor = bgMatch[1];

        // Text color
        const tc = cs.color;
        if (TEXT_LIGHT.some(c => tc === c)) el.style.color = '#1e293b';
        else if (TEXT_MED.some(c => tc === c)) el.style.color = '#64748b';
        else if (CYAN.some(c => tc === c)) el.style.color = '#0d9488';
        else if (ORANGE.some(c => tc === c)) el.style.color = '#c2410c';

        // Border color
        ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'].forEach(prop => {
            const bc = cs[prop];
            if (BORDER_DARK.some(c => {
                // Normalise rgba for comparison
                const norm = (s) => s.replace(/\s/g, '').toLowerCase();
                return norm(bc) === norm(c);
            })) {
                el.style[prop] = '#cbd5e1';
            } else if (CYAN.some(c => bc === c)) {
                el.style[prop] = '#0d9488';
            } else if (ORANGE.some(c => bc === c)) {
                el.style[prop] = '#c2410c';
            }
        });
    });

    // Fix SVG elements (discovery ring)
    clone.querySelectorAll('svg circle[stroke]').forEach(c => {
        if (CYAN.some(v => c.getAttribute('stroke') === v)) c.setAttribute('stroke', '#0d9488');
        if (c.getAttribute('stroke') === 'rgba(102,252,241,0.15)') c.setAttribute('stroke', '#e2e8f0');
    });
    clone.querySelectorAll('svg text').forEach(t => { t.setAttribute('fill', '#1e293b'); });
}

export const downloadReport = async (orgName, onExpandAll, onRestorePanel) => {
    try {
        const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
            import('html2canvas'),
            import('jspdf')
        ]);

        const element = document.getElementById('screen5-content');
        if (!element) {
            console.warn('screen5-content not found');
            alert('Could not find report content to export.');
            return;
        }

        // Expand all outcome panels before capture
        if (onExpandAll) onExpandAll();
        await new Promise(r => setTimeout(r, 400));

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            removeContainer: true,
            foreignObjectRendering: false,
            onclone: (_doc, clonedEl) => { lightenClone(clonedEl); }
        });

        if (onRestorePanel) onRestorePanel();

        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let yOffset = 0;
        let remaining = imgHeight;
        while (remaining > 0) {
            if (yOffset > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, -yOffset, pdfWidth, imgHeight);
            yOffset += pageHeight;
            remaining -= Math.min(pageHeight, remaining);
        }

        const date = new Date().toISOString().split('T')[0];
        const safeName = (orgName || 'Simulation').toString().replace(/[^a-zA-Z0-9]/g, '_');
        pdf.save(`Pithonix_ROI_Report_${safeName}_${date}.pdf`);
    } catch (err) {
        console.error('PDF generation error:', err);
        alert('Could not generate PDF. Please try again.');
        throw err;
    }
};
