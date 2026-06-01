import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

const STATUS_COLOR = {
  pending:    { bg: "#fff3cd", text: "#856404" },
  selesai:    { bg: "#d4edda", text: "#155724" },
  dibatalkan: { bg: "#f8d7da", text: "#721c24" },
};

// ===================== EXCEL EXPORT (pure JS, no library) =====================
function exportToExcel(orders, dateFrom, dateTo) {
  const rows = [
    ["Kode Order", "Meja", "Item", "Total (Rp)", "Status Pesanan", "Status Bayar", "Waktu"],
  ];

  orders.forEach(order => {
    const itemStr = order.order_items?.map(i => `${i.menus?.name} x${i.quantity}`).join(", ") || "—";
    const tanggal = new Date(order.created_at).toLocaleString("id-ID");
    rows.push([
      "#" + order.id.slice(0, 8).toUpperCase(),
      "Meja " + order.table_number,
      itemStr,
      Number(order.total_price),
      order.status,
      order.payment_status || "—",
      tanggal,
    ]);
  });

  // Baris total
  rows.push([]);
  rows.push(["TOTAL PENDAPATAN", "", "", orders.reduce((s, o) => s + Number(o.total_price), 0), "", "", ""]);

  // Konversi ke XML SpreadsheetML (bisa dibuka Excel tanpa library)
  const xml = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Laporan Penjualan">
  <Table>
${rows.map((row, ri) => `   <Row>
${row.map((cell, ci) => {
  const isHeader = ri === 0;
  const isTotal  = ri === rows.length - 1;
  const isNum    = typeof cell === "number";
  const type     = isNum ? "Number" : "String";
  const style    = isHeader ? ` ss:StyleID="header"` : isTotal && ci === 0 ? ` ss:StyleID="total"` : "";
  return `    <Cell${style}><Data ss:Type="${type}">${cell}</Data></Cell>`;
}).join("\n")}
   </Row>`).join("\n")}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  const label = dateFrom && dateTo ? `${dateFrom}_sd_${dateTo}` : new Date().toISOString().slice(0, 10);
  a.href     = url;
  a.download = `Laporan_Penjualan_${label}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

// ===================== PDF EXPORT (print window) =====================
function exportToPDF(orders, dateFrom, dateTo) {
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_price), 0);
  const label = dateFrom && dateTo
    ? `${dateFrom} s/d ${dateTo}`
    : new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const rows = orders.map(order => {
    const itemStr = order.order_items?.map(i => `${i.menus?.name} x${i.quantity}`).join(", ") || "—";
    const tanggal = new Date(order.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    const sc = STATUS_COLOR[order.status] || STATUS_COLOR.pending;
    return `<tr>
      <td>#${order.id.slice(0, 8).toUpperCase()}</td>
      <td>Meja ${order.table_number}</td>
      <td style="max-width:200px;font-size:11px">${itemStr}</td>
      <td style="font-weight:700">Rp${Number(order.total_price).toLocaleString("id")}</td>
      <td><span style="background:${sc.bg};color:${sc.text};padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700">${order.status}</span></td>
      <td style="color:#888;font-size:11px">${tanggal}</td>
    </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Laporan Penjualan – Warkop HS</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #1A1208; padding: 32px; }
    .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #B8860B; padding-bottom: 16px; }
    .header h1 { font-size: 20px; color: #1A1208; }
    .header p  { color: #888; font-size: 12px; margin-top: 4px; }
    .summary { display: flex; gap: 24px; margin-bottom: 20px; }
    .summary-box { flex: 1; background: #FAF3EC; border: 1px solid #E8DCC8; border-radius: 8px; padding: 12px 16px; }
    .summary-box .val { font-size: 18px; font-weight: 800; color: #B8860B; }
    .summary-box .lbl { font-size: 11px; color: #888; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #1A1208; color: #fff; padding: 10px 12px; text-align: left; font-weight: 600; }
    td { padding: 9px 12px; border-bottom: 1px solid #F0F0F0; vertical-align: top; }
    tr:nth-child(even) td { background: #FAFAFA; }
    .footer { margin-top: 24px; text-align: right; font-size: 12px; color: #888; }
    @media print { body { padding: 16px; } button { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Laporan Penjualan – Warkop HS Balio</h1>
    <p>Periode: ${label} &nbsp;|&nbsp; Dicetak: ${new Date().toLocaleString("id-ID")}</p>
  </div>
  <div class="summary">
    <div class="summary-box">
      <div class="val">${orders.length}</div>
      <div class="lbl">Total Order</div>
    </div>
    <div class="summary-box">
      <div class="val">Rp${totalRevenue.toLocaleString("id")}</div>
      <div class="lbl">Total Pendapatan</div>
    </div>
    <div class="summary-box">
      <div class="val">${orders.filter(o => o.status === "selesai").length}</div>
      <div class="lbl">Order Selesai</div>
    </div>
    <div class="summary-box">
      <div class="val">${orders.filter(o => o.status === "pending").length}</div>
      <div class="lbl">Order Pending</div>
    </div>
  </div>
  <table>
    <thead>
      <tr><th>Kode</th><th>Meja</th><th>Item</th><th>Total</th><th>Status</th><th>Waktu</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Total Pendapatan: <strong>Rp${totalRevenue.toLocaleString("id")}</strong></div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=700");
  win.document.write(html);
  win.document.close();
}

// ===================== MAIN SCREEN =====================
export default function LaporanScreen() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [dateFrom, setDateFrom]     = useState("");
  const [dateTo, setDateTo]         = useState("");
  const [exporting, setExporting]   = useState("");

  async function fetchOrders() {
    setLoading(true);
    let query = supabase
      .from("orders")
      .select("*, order_items(quantity, menus(name))")
      .order("created_at", { ascending: false });

    if (filterStatus !== "Semua") query = query.eq("status", filterStatus);
    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo)   query = query.lte("created_at", dateTo + "T23:59:59");

    const { data } = await query;
    if (data) setOrders(data);
    setLoading(false);
  }

  useEffect(() => { fetchOrders(); }, []);

  async function updateStatus(orderId, status) {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    fetchOrders();
  }

  function handleExcel() {
    setExporting("excel");
    setTimeout(() => { exportToExcel(orders, dateFrom, dateTo); setExporting(""); }, 100);
  }

  function handlePDF() {
    setExporting("pdf");
    setTimeout(() => { exportToPDF(orders, dateFrom, dateTo); setExporting(""); }, 100);
  }

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_price), 0);

  const btnBase = {
    display: "flex", alignItems: "center", gap: 6,
    border: "none", borderRadius: 8, padding: "8px 16px",
    fontSize: 13, fontWeight: 700, cursor: "pointer",
    fontFamily: "sans-serif", transition: "opacity 0.15s",
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Laporan Penjualan</h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>
            {orders.length} order &nbsp;·&nbsp; Pendapatan Rp{totalRevenue.toLocaleString("id")}
          </p>
        </div>

        {/* Tombol export */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleExcel}
            disabled={!!exporting || orders.length === 0}
            style={{ ...btnBase, background: "#217346", color: "#fff", opacity: exporting || orders.length === 0 ? 0.5 : 1 }}
          >
            {exporting === "excel" ? "⏳" : "📊"} Export Excel
          </button>
          <button
            onClick={handlePDF}
            disabled={!!exporting || orders.length === 0}
            style={{ ...btnBase, background: "#c0392b", color: "#fff", opacity: exporting || orders.length === 0 ? 0.5 : 1 }}
          >
            {exporting === "pdf" ? "⏳" : "📄"} Export PDF
          </button>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: "8px 12px", border: "1.5px solid #E0E0E0", borderRadius: 8, fontSize: 13, outline: "none" }}
        >
          <option>Semua</option>
          <option value="pending">Pending</option>
          <option value="selesai">Selesai</option>
          <option value="dibatalkan">Dibatalkan</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          style={{ padding: "8px 12px", border: "1.5px solid #E0E0E0", borderRadius: 8, fontSize: 13, outline: "none" }} />
        <span style={{ fontSize: 13, color: "#888" }}>s/d</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          style={{ padding: "8px 12px", border: "1.5px solid #E0E0E0", borderRadius: 8, fontSize: 13, outline: "none" }} />
        <button
          onClick={fetchOrders}
          style={{ ...btnBase, background: "#1A1208", color: "#fff" }}
        >🔍 Filter</button>
        {(dateFrom || dateTo || filterStatus !== "Semua") && (
          <button
            onClick={() => { setDateFrom(""); setDateTo(""); setFilterStatus("Semua"); setTimeout(fetchOrders, 0); }}
            style={{ ...btnBase, background: "#F0F0F0", color: "#555" }}
          >✕ Reset</button>
        )}
      </div>

      {/* Tabel */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8E8E8", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#aaa" }}>Memuat...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#aaa" }}>Tidak ada data</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8F8F8", borderBottom: "1px solid #E8E8E8" }}>
                  {["Kode Order", "Meja", "Item", "Total", "Status Pesanan", "Status Bayar", "Waktu", "Ubah Status"].map(h => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const sc      = STATUS_COLOR[order.status] || STATUS_COLOR.pending;
                  const tanggal = new Date(order.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
                  const itemStr = order.order_items?.map(i => `${i.menus?.name} x${i.quantity}`).join(", ") || "—";
                  const isPaid  = order.payment_status === "paid";

                  return (
                    <tr key={order.id} style={{ borderBottom: i < orders.length - 1 ? "1px solid #F5F5F5" : "none" }}>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 11, color: "#555" }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>Meja {order.table_number}</td>
                      <td style={{ padding: "12px 14px", color: "#666", maxWidth: 200, fontSize: 12 }}>{itemStr}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 700 }}>Rp{Number(order.total_price).toLocaleString("id")}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ background: sc.bg, color: sc.text, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          background: isPaid ? "#d4edda" : "#fff3cd",
                          color: isPaid ? "#155724" : "#856404",
                          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                        }}>
                          {isPaid ? "✓ Lunas" : "⏳ Belum Bayar"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", color: "#888", fontSize: 12, whiteSpace: "nowrap" }}>{tanggal}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          style={{ padding: "5px 8px", border: "1px solid #E0E0E0", borderRadius: 6, fontSize: 12, outline: "none", cursor: "pointer" }}
                        >
                          <option value="pending">Pending</option>
                          <option value="selesai">Selesai</option>
                          <option value="dibatalkan">Dibatalkan</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: "#F8F8F8", borderTop: "2px solid #E8E8E8" }}>
                  <td colSpan={3} style={{ padding: "12px 14px", fontWeight: 700, fontSize: 13 }}>Total ({orders.length} order)</td>
                  <td style={{ padding: "12px 14px", fontWeight: 800, color: "#B8860B", fontSize: 14 }}>
                    Rp{totalRevenue.toLocaleString("id")}
                  </td>
                  <td colSpan={4} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}