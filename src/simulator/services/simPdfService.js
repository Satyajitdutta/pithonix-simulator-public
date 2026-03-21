export const downloadReport = async (orgName) => {
    try {
        const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
            import('html2canvas'),
            import('jspdf')
        ]);

        const element = document.getElementById('screen5-content');
        if (!element) { console.warn('screen5-content not found'); return; }

        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#F8FAFC' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        const date = new Date().toISOString().split('T')[0];
        const safeName = orgName.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `Pithonix_Simulation_${safeName}_${date}.pdf`;

        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('PDF generation error:', err);
        throw err;
    }
};
