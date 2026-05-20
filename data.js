export const menuData = [
  { id: 1, name: "Kopi Hitam", kategori: "Minuman", harga: 6000, tersedia: true, img: "☕" },
  { id: 2, name: "Pancong Lumer Keju Coklat", kategori: "Pancong", harga: 14000, tersedia: false, img: "🧇" },
  { id: 3, name: "Good Day Freeze", kategori: "Minuman", harga: 7000, tersedia: true, img: "🥤" },
  { id: 4, name: "Magelangan", kategori: "Magelangan", harga: 12000, tersedia: true, img: "🍜" },
  { id: 5, name: "Internet Rebus", kategori: "Mie Rebus", harga: 18000, tersedia: true, img: "🍝" },
  { id: 6, name: "Kopi Susu", kategori: "Minuman", harga: 10000, tersedia: true, img: "☕" },
  { id: 7, name: "Teh Tarik", kategori: "Minuman", harga: 8000, tersedia: true, img: "🧋" },
  { id: 8, name: "Pancong Tiramisu", kategori: "Pancong", harga: 13000, tersedia: true, img: "🧇" },
  { id: 9, name: "Nasi Goreng", kategori: "Nasi", harga: 15000, tersedia: true, img: "🍳" },
  { id: 10, name: "Indomie Rebus Telur", kategori: "Mie Rebus", harga: 12000, tersedia: true, img: "🍝" },
];

export const stokData = [
  { id: 1, name: "Kopi Hitam", kategori: "Minuman", jumlah: 42 },
  { id: 2, name: "Pancong Lumer Keju Coklat", kategori: "Pancong", jumlah: 4 },
  { id: 3, name: "Good Day Freeze", kategori: "Minuman", jumlah: 0 },
  { id: 4, name: "Magelangan", kategori: "Magelangan", jumlah: 3 },
  { id: 5, name: "Internet Rebus", kategori: "Mie Rebus", jumlah: 5 },
  { id: 6, name: "Kopi Susu", kategori: "Minuman", jumlah: 5 },
  { id: 7, name: "Nasi Goreng", kategori: "Nasi", jumlah: 3 },
  { id: 8, name: "Cappuccino", kategori: "Minuman", jumlah: 0 },
  { id: 9, name: "Teh Tarik", kategori: "Minuman", jumlah: 22 },
  { id: 10, name: "Indomie Goreng", kategori: "Mie Goreng", jumlah: 18 },
];

export const transaksiData = [
  { kode: "#RFW00042", meja: "Meja 4", item: "Kopi Hitam, Internet Rebus", total: 18000, waktu: "20:15", metode: "QRIS", status: "Selesai" },
  { kode: "#RFW00043", meja: "Meja 2", item: "Magelangan, Good Day Freeze", total: 26000, waktu: "20:09", metode: "Tunai", status: "Selesai" },
  { kode: "#RFW00044", meja: "Meja 6", item: "Pancong Lumer Keju Coklat", total: 14000, waktu: "20:01", metode: "QRIS", status: "Diproses" },
  { kode: "#RFW00045", meja: "Meja 3", item: "Pancong Tiramisu", total: 13000, waktu: "19:52", metode: "Tunai", status: "Selesai" },
  { kode: "#RFW00046", meja: "Meja 7", item: "Teh Tarik, Indomie Rebus Telur", total: 17000, waktu: "19:44", metode: "QRIS", status: "Selesai" },
  { kode: "#RFW00047", meja: "Meja 1", item: "Pancong Tiramisu, Kopi Susu", total: 22000, waktu: "20:30", metode: "Tunai", status: "Baru" },
  { kode: "#RFW00048", meja: "Meja 9", item: "Pancong Lumer Keju Coklat, Air Putih", total: 18000, waktu: "18:01", metode: "QRIS", status: "Diproses" },
  { kode: "#RFW00049", meja: "Meja 5", item: "Magelangan, Air Putih", total: 22000, waktu: "19:30", metode: "QRIS", status: "Baru" },
  { kode: "#RFW00050", meja: "Meja 8", item: "Indomie Goreng Keju", total: 10000, waktu: "19:59", metode: "Tunai", status: "Diproses" },
  { kode: "#RFW00051", meja: "Meja 5", item: "Kopi Susu, Nasi Goreng", total: 25000, waktu: "21:00", metode: "QRIS", status: "Selesai" },
];

export const formatRp = (n) => `Rp ${n.toLocaleString("id-ID")}`;