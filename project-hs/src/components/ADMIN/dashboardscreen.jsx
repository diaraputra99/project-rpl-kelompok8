import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "20px 24px",
      border: "1px solid #E8E8E8", display: "flex", alignItems: "center", gap: 16,
    }}>
      <div style={{ fontSize: 32, width: 52, height: 52, background: color + "22", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#888", fontWeight: 600, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1208" }}>{value}</div>
      </div>
    </div>
  );
}

function OrderRow({ order }) {
  const tanggal = new Date(order.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const statusColor = { pending: "#856404", selesai: "#155724", dibatalkan: "#721c24" };
  const statusBg    = { pending: "#fff3cd", selesai: "#d4edda", dibatalkan: "#f8d7da" };

  return (
    <tr style={{ borderBottom: "1px solid #F5F5F5" }}>
      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: "#555" }}>
        #{order.id.slice(0, 8).toUpperCase()}
      </td>
      <td style={{ padding: "12px 16px", fontWeight: 600 }}>Meja {order.table_number}</td>
      <td style={{ padding: "12px 16px", fontWeight: 700 }}>
        Rp{Number(order.total_price).toLocaleString("id")}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <span style={{
          background: statusBg[order.status] || "#eee",
          color: statusColor[order.status] || "#333",
          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
        }}>
          {order.status === "pending" ? "⏳ Pending" : order.status === "selesai" ? "✓ Selesai" : order.status}
        </span>
      </td>
      <td style={{ padding: "12px 16px", color: "#888", fontSize: 12 }}>{tanggal}</td>
    </tr>
  );
}

export default function DashboardScreen({ setPage }) {
  const [stats, setStats]   = useState({ orders: 0, revenue: 0, menu: 0, pending: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      { data: allOrders },
      { count: menuCount },
    ] = await Promise.all([
      supabase.from("orders").select("*").gte("created_at", today.toISOString()).order("created_at", { ascending: false }),
      supabase.from("menus").select("*", { count: "exact", head: true }).eq("is_available", true),
    ]);

    if (allOrders) {
      const revenue = allOrders.reduce((s, o) => s + Number(o.total_price), 0);
      const pending = allOrders.filter(o => o.status === "pending").length;
      setStats({ orders: allOrders.length, revenue, menu: menuCount || 0, pending });
      setOrders(allOrders.slice(0, 10));
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();

    // Realtime: update dashboard saat ada order baru
    const channel = supabase
      .channel("dashboard-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Dashboard</h2>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon="📦" label="Total Order Hari Ini" value={loading ? "..." : stats.orders} color="#1A1208" />
        <StatCard icon="💰" label="Pendapatan Hari Ini" value={loading ? "..." : "Rp" + stats.revenue.toLocaleString("id")} color="#B8860B" />
        <StatCard icon="⏳" label="Order Pending" value={loading ? "..." : stats.pending} color="#e67e22" />
        <StatCard icon="🍽" label="Menu Aktif" value={loading ? "..." : stats.menu} color="#27ae60" />
      </div>

      {/* Tabel order terbaru */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E8E8E8", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F0F0F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Order Terbaru Hari Ini</h3>
          <button
            onClick={() => setPage("laporan")}
            style={{ background: "none", border: "none", color: "#B8860B", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            Lihat Semua →
          </button>
        </div>
        {loading ? (
          <div style={{ padding: 32, textAlign: "center", color: "#aaa" }}>Memuat...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#aaa" }}>Belum ada order hari ini</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8F8F8" }}>
                {["Kode", "Meja", "Total", "Status", "Waktu"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#555" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => <OrderRow key={o.id} order={o} />)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}