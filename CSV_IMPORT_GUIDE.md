# CSV Import Guide untuk Guests

## Format CSV

File CSV harus memiliki kolom berikut (dalam urutan ini):

```csv
name,session,totalGuest,whatsapp
```

### Kolom Deskripsi:

1. **name** (Required) - Nama tamu
2. **session** (Required) - Sesi undangan: `1` atau `2`
3. **totalGuest** (Required) - Jumlah tamu yang diizinkan: `1`, `2`, `3`, dst
4. **whatsapp** (Optional) - Nomor WhatsApp format: `628xxxxxxxxxx`

## Contoh Format

```csv
name,session,totalGuest,whatsapp
John Doe,1,2,628123456789
Jane Smith,1,1,628987654321
Bob Wilson,2,3,628111222333
Alice Brown,2,1,628444555666
```

## Cara Import:

1. Download template CSV dari button "Template"
2. Edit file dengan data tamu Anda
3. Simpan sebagai CSV (UTF-8)
4. Klik button "Import CSV"
5. Pilih file CSV yang sudah diedit
6. Tunggu proses import selesai

## Catatan Penting:

- **Jangan ubah header** (baris pertama)
- **Gunakan koma** sebagai separator
- **Nomor WhatsApp** harus format internasional tanpa `+` atau `-`
  - ✅ Benar: `628123456789`
  - ❌ Salah: `+62-812-3456-789` atau `0812-3456-789`
- **Session** hanya boleh `1` atau `2`
- **totalGuest** harus angka positif
- **Nama** tidak boleh kosong
- Setiap guest akan otomatis mendapat **UUID slug** unik

## Troubleshooting:

### Import gagal?
- Pastikan format CSV sesuai template
- Cek tidak ada baris kosong di tengah data
- Pastikan semua kolom required terisi
- Coba buka file dengan text editor untuk cek format

### Nomor WhatsApp tidak valid?
- Harus dimulai dengan kode negara (62 untuk Indonesia)
- Tidak boleh ada spasi, tanda hubung, atau karakter khusus
- Contoh valid: `628123456789`

## Setelah Import:

- UUID slug akan di-generate otomatis untuk setiap guest
- Link undangan format: `yoursite.com/?guest=uuid-slug`
- Anda bisa langsung copy link atau send via WhatsApp dari tabel
