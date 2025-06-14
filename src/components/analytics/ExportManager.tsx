
import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { Download } from 'lucide-react';

interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
}

export const useExportManager = () => {
  const exportToCSV = (data: ExportData) => {
    try {
      const csvContent = [
        data.headers.join(','),
        ...data.rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${data.filename}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `${data.filename}.csv has been downloaded.`
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export CSV file.",
        variant: "destructive"
      });
    }
  };

  const exportToPDF = async (data: ExportData) => {
    try {
      // Simple HTML table for PDF generation
      const htmlContent = `
        <html>
          <head>
            <title>${data.filename}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              h1 { color: #333; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>${data.filename}</h1>
            <table>
              <thead>
                <tr>${data.headers.map(header => `<th>${header}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${data.rows.map(row => 
                  `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
                ).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }

      toast({
        title: "PDF Export",
        description: "PDF print dialog opened."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF file.",
        variant: "destructive"
      });
    }
  };

  return { exportToCSV, exportToPDF };
};
