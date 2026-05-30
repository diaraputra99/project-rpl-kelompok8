import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

const STATUS_COLOR = {
  pending:    { bg: "#fff3cd", text: "#856404" },
  selesai:    { bg: "#d4edda", text: "#155724" },
  dibatalkan: { bg: "#f8d7da", text: "#721c24" },
};

export default function LaporanScreen() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");

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

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_price), 0);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Laporan Penjualan</h2>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>Total {orders.length} order • Pendapatan Rp{totalRevenue.toLocaleString("id")}</p>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <select
          style={{ padding: "8px 12px", border: "1.5px solid #E0E0E0", borderRadius: 8, fontSize: 13, outline: "none" }}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
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
          style={{ background: "#1A1208", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >Filter</button>
      </div>

      {/* Tabel */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E8E8E8", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#aaa" }}>Memuat...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#aaa" }}>Tidak ada data</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8F8F8", borderBottom: "1px solid #E8E8E8" }}>
                {["Kode Order", "Meja", "Item", "Total", "Status", "Waktu", "Ubah Status"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const sc      = STATUS_COLOR[order.status] || STATUS_COLOR.pending;
                const tanggal = new Date(order.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
                const itemStr = order.order_items?.map(i => `${i.menus?.name} x${i.quantity}`).join(", ") || "—";

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
          </table>
        )}
      </div>
    </div>
  );
}