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
        await new Promise(r => setTimeout(r, 400)); // wait for React re-render + animations

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#0b0c10',
            logging: false,
            removeContainer: true,
            foreignObjectRendering: false
        });

        // Restore panel state after capture
        if (onRestorePanel) onRestorePanel();

        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // Multi-page support — slice into A4 pages
        let yOffset = 0;
        let remaining = imgHeight;
        while (remaining > 0) {
            if (yOffset > 0) pdf.addPage();
            const sliceHeight = Math.min(pageHeight, remaining);
            pdf.addImage(imgData, 'JPEG', 0, -yOffset, pdfWidth, imgHeight);
            yOffset += pageHeight;
            remaining -= sliceHeight;
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
