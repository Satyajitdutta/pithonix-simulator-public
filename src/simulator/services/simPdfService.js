export const downloadReport = async (orgName) => {
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

        // Use scale: 1.5 to balance quality and file size (prevents 20MB+ files)
        const canvas = await html2canvas(element, {
            scale: 1.5,
            useCORS: true,
            backgroundColor: '#F8FAFC',
            logging: false
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.85); // Use JPEG with 85% quality to significantly reduce size
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

        const date = new Date().toISOString().split('T')[0];
        const safeName = (orgName || 'Simulation').toString().replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `Pithonix_ROI_Report_${safeName}_${date}.pdf`;

        // Use native jsPDF save method
        pdf.save(fileName);
    } catch (err) {
        console.error('PDF generation error:', err);
        alert('Could not generate PDF. Please try again or check your browser console.');
        throw err;
    }
};
