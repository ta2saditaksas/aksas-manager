function ImpressionDevis({ devis }) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const total = devis.total || devis.lignes?.reduce((sum, l) => sum + l.montant, 0) || 0;

    const lignesHTML = devis.lignes?.map(l => `
      <tr>
        <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${l.quantite}</td>
        <td style="border: 1px solid #000; padding: 6px 8px;">${l.designation}</td>
        <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${l.prixUnitaire ? l.prixUnitaire.toLocaleString() : '-'}</td>
        <td style="border: 1px solid #000; padding: 6px 8px; text-align: right;">${l.montant ? l.montant.toLocaleString() : '-'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${devis.reference}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 13px; padding: 20px; }
          .header { text-align: center; margin-bottom: 10px; }
          .header h1 { font-size: 28px; font-weight: bold; letter-spacing: 2px; }
          .header h1 span { color: #e8a000; }
          .header p { font-size: 11px; margin-top: 2px; }
          .info-box { border: 1px solid #000; padding: 8px 12px; margin: 10px 0; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
          .doc-title { display: flex; justify-content: space-between; margin: 10px 0; font-weight: bold; font-size: 14px; border: 1px solid #000; padding: 6px 12px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th { border: 1px solid #000; padding: 6px 8px; background: #f0f0f0; font-weight: bold; }
          .totaux { margin-left: auto; width: 300px; margin-top: 4px; }
          .totaux table { width: 100%; }
          .totaux td { border: 1px solid #000; padding: 6px 10px; }
          .totaux .label { font-weight: bold; }
          .totaux .montant { text-align: right; font-weight: bold; }
          .validite { margin-top: 16px; font-size: 11px; font-style: italic; }
          @media print {
            body { padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ETS AK<span>S</span>AS</h1>
          <p>LAMINAGE & PROFILAGE A FROID DE L'ACIER COURANT</p>
          <p>RN 12 THALA N'ZOUCHE CHAIB MEKLA</p>
          <p>TEL/FAX : 026 37 01 17 &nbsp;&nbsp;&nbsp; 0770 780 862 &nbsp;&nbsp;&nbsp; 0770 780 640</p>
        </div>

        <div class="doc-title">
          <span>DEVIS</span>
          <span>N° ${devis.reference}</span>
        </div>

        <div class="info-box">
          <div class="info-grid">
            <div><strong>Client :</strong> ${devis.client?.nom || ''} ${devis.client?.prenom || ''}</div>
            <div><strong>Date :</strong> ${new Date(devis.createdAt).toLocaleDateString('fr-FR')}</div>
            <div><strong>TEL :</strong> ${devis.client?.telephone || ''}</div>
            <div></div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 80px;">QUANTITE</th>
              <th>DESIGNATION</th>
              <th style="width: 100px;">PRIX/U</th>
              <th style="width: 120px;">MONTANT</th>
            </tr>
          </thead>
          <tbody>
            ${lignesHTML}
          </tbody>
        </table>

        <div class="totaux">
          <table>
            <tr>
              <td class="label">TOTAL</td>
              <td class="montant">${total.toLocaleString()} DA</td>
            </tr>
          </table>
        </div>

        <p class="validite">Ce devis est valable 15 jours à compter de sa date d'émission.</p>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <button
      onClick={handlePrint}
      style={{
        padding: '5px 12px', background: 'white', color: '#1a4fa0',
        border: '0.5px solid #1a4fa0', borderRadius: 6,
        cursor: 'pointer', fontSize: 12, fontWeight: 500
      }}
    >
      🖨️ Imprimer
    </button>
  );
}

export default ImpressionDevis;