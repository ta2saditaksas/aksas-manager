function ImpressionLivraison({ livraison }) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');

    const lignesHTML = livraison.lignes?.map(l => {
      const ligneCommande = livraison.commande?.lignes?.find(lc => lc.id === l.ligneCommandeId);
      return `
        <tr>
          <td style="border: 1px solid #000; padding: 6px 8px;">${ligneCommande?.designation || '-'}</td>
          <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${ligneCommande?.quantite || '-'}</td>
          <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${l.quantiteLivree}</td>
          <td style="border: 1px solid #000; padding: 6px 8px; text-align: center;">${ligneCommande ? ligneCommande.quantite - ligneCommande.quantiteLivree : '-'}</td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${livraison.reference}</title>
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
          <span>BON DE LIVRAISON</span>
          <span>N° ${livraison.reference}</span>
        </div>

        <div class="info-box">
          <div class="info-grid">
            <div><strong>Client :</strong> ${livraison.commande?.client?.nom || ''} ${livraison.commande?.client?.prenom || ''}</div>
            <div><strong>Date :</strong> ${new Date(livraison.dateLivraison).toLocaleDateString('fr-FR')}</div>
            <div><strong>TEL :</strong> ${livraison.commande?.client?.telephone || ''}</div>
            <div><strong>Commande :</strong> ${livraison.commande?.reference || ''}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>DESIGNATION</th>
              <th style="width: 100px;">QTE COMMANDEE</th>
              <th style="width: 100px;">QTE LIVREE</th>
              <th style="width: 100px;">RESTE A LIVRER</th>
            </tr>
          </thead>
          <tbody>
            ${lignesHTML}
          </tbody>
        </table>

        ${livraison.notes ? `<p style="margin-top: 12px; font-size: 12px;"><strong>Notes :</strong> ${livraison.notes}</p>` : ''}
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

export default ImpressionLivraison;