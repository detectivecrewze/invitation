export type Locale = "id" | "en";

export function normaliseLocale(value: unknown, fallback: Locale = "id"): Locale {
  return value === "id" || value === "en" ? value : fallback;
}

const PAIRS: [string, string][] = [
  ["Studio Editor", "Studio Editor"], ["Rundown Studio", "Rundown Studio"],
  ["Tema", "Theme"], ["Info", "Info"], ["Foto", "Photo"], ["Aktivitas", "Activities"],
  ["Informasi Dasar", "Basic Information"], ["Nama Penerima", "Recipient Name"], ["Nama Pengirim", "Sender Name"],
  ["Format Aktif", "Active Format"], ["Ubah Format ⚙️", "Change Format ⚙️"],
  ["Gagal mengubah format. Coba lagi.", "Could not change the format. Please try again."],
  ["Gagal menyimpan", "Could not save"], ["Gagal memproses gambar. Coba lagi.", "Could not process the image. Please try again."],
  ["Klik untuk intip perbedaan / ubah format undangan", "Click to compare or change the invitation format"],
  ["Format Undangan Kencan ✨", "Date Invitation Format ✨"], ["Pilih format terbaik untuk momen kalian", "Choose the best format for your moment"],
  ["Format: Invitation ⚙️", "Format: Invitation ⚙️"], ["Format: Rundown ⚙️", "Format: Rundown ⚙️"],
  ["Rundown Date (Itinerary)", "Rundown Date (Itinerary)"], ["Rundown berhasil dipublish!", "Rundown published successfully!"],
  ["Rundown Undangan Siap!", "Your Rundown Invitation Is Ready!"], ["Bahasa", "Language"], ["Bahasa Antarmuka", "Interface Language"],
  ["Lanjut", "Next"], ["Kembali", "Back"], ["Publish", "Publish"], ["Simpan", "Save"], ["Hapus", "Remove"],
  ["Pilih Icon atau Emoji", "Choose Icon or Emoji"], ["Kegiatan", "Activity"], ["Tap icon untuk ganti SVG / Emoji", "Tap the icon to change the SVG / emoji"],
  ["Geser ke atas", "Move up"], ["Geser ke bawah", "Move down"], ["Dress Code", "Dress Code"], ["Rundown", "Rundown"], ["Note", "Note"],
  ["Judul Rundown", "Rundown Title"], ["Tambah Kegiatan", "Add Activity"], ["Waktu", "Time"], ["Lokasi", "Location"], ["Catatan", "Note"],
  ["Undangan kamu sudah siap!", "Your invitation is ready!"], ["Salin Link", "Copy Link"], ["Lihat Undangan", "View Invitation"],
  ["Tap untuk ubah", "Tap to change"], ["Pilih Tema Warna", "Choose a Color Theme"],
  ["Warna ini akan mewarnai seluruh undangan kamu", "This color will style your entire invitation"],
  ["Bentuk Animasi Opening ✨", "Opening Animation Shape ✨"],
  ["Shape yang akan terbentuk dari bunga saat animasi pembuka", "The shape formed by flowers during the opening animation"],
  ["Nama yang akan muncul di undangan", "The name shown on the invitation"], ["Intip Tampilan", "Preview Position"],
  ["Nama Kamu", "Your Name"], ["Sub-teks Ajakan (opsional)", "Invitation Subtext (Optional)"],
  ["Nama pacar / orang spesialmu", "Your partner / special person’s name"], ["Nama kamu sendiri", "Your own name"],
  ["contoh: maukah kamu kencan denganku?", "example: would you like to go out with me?"],
  ["Judul Animasi Opening", "Opening Animation Title"],
  ["Teks yang muncul sebelum namamu di animasi pembuka (default: “Invitation From”)", "Text shown before your name in the opening animation (default: “Invitation From”)"],
  ["Judul Tiket Akhir (opsional)", "Final Ticket Title (Optional)"],
  ["Judul utama di bagian atas tiket kencan (default: “Tiket kencan”)", "The main title at the top of the date ticket (default: “Date Ticket”)"],
  ["Pesan Penutup di Tiket (opsional)", "Closing Message on Ticket (Optional)"],
  ["Akan tampil di bagian bawah tiket kencan", "Shown at the bottom of the date ticket"],
  ["Foto Polaroid", "Polaroid Photo"], ["Foto special yang akan ditempel di kartu undangan", "A special photo attached to the invitation card"],
  ["Ganti foto", "Change Photo"], ["Tap untuk upload foto", "Tap to upload a photo"],
  ["Akan tampil sebagai bingkai polaroid", "Shown in a polaroid frame"], ["Latar Musik (Opsional)", "Background Music (Optional)"],
  ["Pilih", "Choose"], ["Pilihan Aktivitas", "Activity Choices"],
  ["Centang aktivitas yang tersedia untuk dipilih penerima", "Select the activities available to the recipient"],
  ["Judul Section Aktivitas", "Activity Section Title"], ["Tampil di halaman pilihan kegiatan", "Shown on the activity selection page"],
  ["Judul Section Tanggal", "Date Section Title"], ["Tampil di halaman pilih tanggal kencan", "Shown on the date selection page"],
  ["💡 Tap tombol emoji di sebelah kiri untuk mengganti emoji tiap pilihan tempat!", "💡 Tap the emoji button on the left to change each activity icon!"],
  ["Pilihan Dress Code", "Dress Code Choices"], ["Centang dress code yang akan tersedia", "Select the available dress codes"],
  ["Publish Undangan", "Publish Invitation"], ["Review terakhir sebelum dikirim ke orang spesialmu", "Final review before sending it to your special person"],
  ["Scan Untuk Membuka", "Scan to Open"], ["Link Undangan", "Invitation Link"], ["Buka Gift", "Open Gift"], ["Kembali ke awal", "Back to Start"],
  ["Pilih Latar Musik", "Choose Background Music"], ["Tempel Link Musik (MP3 / Audio URL)", "Paste Music Link (MP3 / Audio URL)"],
  ["Pasang Link Musik Ini", "Use This Music Link"], ["— ATAU PILIH DARI PRESET —", "— OR CHOOSE A PRESET —"],
  ["Tanpa Musik", "No Music"], ["Undangan tanpa iringan lagu", "Invitation without background music"],
  ["Pratinjau Posisi Tampilan", "Layout Position Preview"], ["Paham & Tutup", "Got It & Close"],
  ["Pilih Emoji Tempat ✨", "Choose an Activity Emoji ✨"], ["Selesai", "Done"],
  ["Gambar terlalu besar. Maks 8MB.", "Image is too large. Maximum 8MB."], ["Foto berhasil diunggah!", "Photo uploaded!"],
  ["Upload gagal, coba lagi.", "Upload failed. Please try again."], ["Isi nama pengirim & penerima dulu!", "Enter the sender and recipient names first!"],
  ["Terjadi kesalahan. Coba lagi.", "Something went wrong. Please try again."], ["Link musik berhasil dipasang!", "Music link added!"],
  ["Kartu Barcode berhasil diunduh!", "Barcode card downloaded!"], ["Gagal mengunduh barcode. Coba lagi.", "Could not download the barcode. Please try again."],
  ["Klik untuk intip posisi tampilan di undangan", "Click to preview its position on the invitation"], ["Klik untuk ganti emoji", "Click to change the emoji"],
  ["Tulis pesan spesial yang akan muncul di tiket kencan...", "Write a special message to show on the date ticket..."],
  ["Judul Lagu (opsional: misal Lagu Kenangan Kita)", "Song Title (optional, e.g. Our Special Song)"],
  ["Tap icon untuk ganti SVG / Emoji", "Tap the icon to change the SVG / emoji"], ["Vector (SVG)", "Vector (SVG)"],
  ["Tutup ✕", "Close ✕"], ["Paste Emoji:", "Paste Emoji:"], ["Atau Pilih Emoji Populer:", "Or Choose a Popular Emoji:"],
  ["Waktu / Jam", "Time"], ["Judul Kegiatan", "Activity Title"], ["Nama Lokasi / Tempat", "Location / Venue Name"],
  ["Link Google Maps (Opsional)", "Google Maps Link (Optional)"], ["Catatan Tambahan (Opsional)", "Additional Note (Optional)"],
  ["Terpilih:", "Selected:"], ["Pilih Musik", "Choose Music"],
  ["Lagu romantis pilihanmu yang akan otomatis berputar saat pasangan membuka undangan.", "Your chosen romantic song will play automatically when the invitation opens."],
  ["Maks 8 MB", "Maximum 8 MB"], ["Judul Header Rundown", "Rundown Header Title"],
  ["Belum ada kegiatan rundown.", "No rundown activities yet."], ["Klik tombol di bawah untuk menambah kegiatan baru.", "Click the button below to add a new activity."],
  ["Tambah Kegiatan Rundown", "Add Rundown Activity"], ["Note Dari Kamu", "A Note from You"],
  ["Tuliskan catatan atau pesan singkat untuk pasanganmu. Pasangan cukup membaca note ini & langsung melihat tiket kencan.", "Write a short note for your partner. They can read it before viewing the date ticket."],
  ["PRATINJAU TAMPILAN NOTE", "NOTE LAYOUT PREVIEW"], ["Menyimpan rundown...", "Saving rundown..."],
  ["Undangan Rundown Berhasil Dibuat!", "Rundown Invitation Created!"], ["PRATINJAU KARTU BARCODE", "BARCODE CARD PREVIEW"],
  ["Link Undangan Penerima", "Recipient Invitation Link"], ["Buka Undangan", "Open Invitation"], ["Edit Surat Lagi", "Edit Again"],
  ["Latar Musik Undangan", "Invitation Background Music"], ["Pilih lagu romantis atau tempel link audio MP3", "Choose a romantic song or paste an MP3 audio link"],
  ["— ATAU PILIH DARI PRESET LAGU ROMANTIS —", "— OR CHOOSE A ROMANTIC SONG PRESET —"],
  ["Pilih Ikon Dress Code ✨", "Choose a Dress Code Icon ✨"], ["Atau Pilih Emoji Outfit Populer:", "Or Choose a Popular Outfit Emoji:"],
  ["Selesai & Simpan", "Done & Save"], ["Membuka rencana satu per satu...", "Revealing each plan one by one..."],
  ["Sesuatu yang spesial menantimu", "Something special awaits you"], ["Ketuk untuk membuka", "Tap to open"],
  ["Tunggu sebentar, bunganya sedang bermekaran...", "Please wait, the flowers are blooming..."],
  ["Undangan Spesial", "Special Invitation"], ["Ya", "Yes"], ["Tidak", "No"], ["rencana kita", "our plans"], ["Oke", "Okay"],
  ["biar makin niat", "to make it extra special"], ["Dress code-nya?", "What should we wear?"],
  ["terakhir", "one last thing"], ["Ada pesan buat", "A message for"], ["Bikin tiketnya", "Create the ticket"],
  ["Yeay, jadi kencan!", "Yeay, it's a date!"], ["Simpan tiketmu di bawah", "Save your ticket below"],
  ["PANDUAN GAYA & OUTFIT", "STYLE & OUTFIT GUIDE"], ["Dress Code Spesial", "Special Dress Code"],
  ["Pakai pakaian terbaikmu sesuai panduan outfit di bawah ini!", "Wear your best outfit using the guide below!"],
  ["Membuka kegiatan berikutnya...", "Revealing the next activity..."], ["⚡ Tampilkan Semua Sekaligus", "⚡ Show Everything at Once"],
  ["AKSES VIP", "VIP ACCESS"], ["VIP Pass Kencan Spesial", "Special Date VIP Pass"],
  ["Ketuk untuk memindai VIP Pass", "Tap to Scan VIP Pass"], ["Rencana spesial menantimu", "Special itinerary awaits you"],
  ["Rencana spesial telah disiapkan khusus untukmu.", "Special plans have been crafted exclusively for you."],
  ["CATATAN & DEDIKASI PRIBADI", "PERSONAL NOTE & DEDICATION"], ["Lanjut", "Next"],
  ["OUTFIT DRESS CODE", "DRESS CODE OUTFIT"], ["PESAN BALASAN", "REPLY MESSAGE"], ["Bagikan ke WA", "Share to WhatsApp"],
  ["Buka ulang dari awal", "Open Again from the Start"], ["Mengunduh Tiket...", "Downloading Ticket..."],
  ["Simpan Gambar Tiket (PNG)", "Save Ticket Image (PNG)"], ["Link Tersalin!", "Link Copied!"], ["Salin Link Tiket", "Copy Ticket Link"]
  ,["Gagal mengunduh gambar tiket. Silakan screenshot layar HP milikmu!", "Could not download the ticket image. Please take a screenshot on your phone!"],
  ["Pilih Tema", "Choose a Theme"], ["Warna khas untuk seluruh tampilan undangan", "Signature colors for the whole invitation"],
  ["Judul Utama (Cover Foto)", "Main Title (Photo Cover)"], ["Tanggal Kencan / Acara", "Date / Event"],
  ["Label Cover (Atas Foto)", "Cover Label (Above Photo)"], ["Foto Spesial", "Special Photo"],
  ["Foto kenangan bersama yang akan muncul di undangan", "A shared memory photo that appears in the invitation"],
  ["Pilih dress code pilihanmu, edit teks & pilih icon SVG (sepatu, celana, dress, dll)", "Choose dress codes, edit their text, and select SVG icons (shoes, pants, dress, and more)"],
  ["Contoh jadwal dalam Bahasa Inggris sudah terisi. Silakan edit atau tambah kegiatan.", "An English sample schedule is ready. Edit it or add activities."],
  ["Pesan Pendek / Note", "Short Message / Note"], ["Catatan singkat dari kamu untuk pasanganmu sebelum melihat tiket", "A short note for your partner before they view the ticket"],
  ["Nama pasangan yang menerima rundown ini", "The partner receiving this rundown"], ["Namamu — muncul sebagai 'dari ...' di bawah judul cover", "Your name — shown as 'from ...' below the cover title"],
  ["Teks kecil yang muncul di pojok kiri atas cover foto — identitas acara ini", "Small text in the top-left of the photo cover — the event identity"],
  ["Hapus kegiatan", "Remove activity"], ["Download Barcode (PNG)", "Download Barcode (PNG)"], ["Mengunduh Barcode...", "Downloading Barcode..."],
  ["Salin Link Undangan", "Copy Invitation Link"], ["Undangan tanpa iringan musik", "Invitation without background music"],
  ["Dengarkan pratinjau lagu", "Listen to song preview"], ["Pilih Ikon Dress Code ✨", "Choose a Dress Code Icon ✨"],
  ["Invitation Date (Interaktif)", "Interactive Date Invitation"], ["Pilih Tanggal", "Choose a Date"],
  ["rencana kita", "our plans"], ["buat", "for"], ["atau tulis ide kamu...", "or write your own idea..."],
  ["Pagi", "Morning"], ["Siang", "Afternoon"], ["Sore", "Evening"], ["Malam", "Night"],
  ["Januari", "January"], ["Februari", "February"], ["Maret", "March"], ["April", "April"], ["Mei", "May"], ["Juni", "June"],
  ["Juli", "July"], ["Agustus", "August"], ["September", "September"], ["Oktober", "October"], ["November", "November"], ["Desember", "December"],
  ["Min", "Sun"], ["Sen", "Mon"], ["Sel", "Tue"], ["Rab", "Wed"], ["Kam", "Thu"], ["Jum", "Fri"], ["Sab", "Sat"],
  ["Kapan sayangku free?", "When are you free, love?"], ["Nanti kita ngapain sayang?", "What should we do, love?"],
  ["Makan Malam", "Dinner"], ["Nonton Film", "Watch a Movie"], ["Jalan-Jalan", "Take a Walk"], ["Main Game", "Play Games"], ["Belanja", "Shopping"], ["Ngopi Bareng", "Coffee Together"],
  ["Matikan musik", "Turn off music"], ["Aktifkan musik", "Turn on music"], ["contoh : jangan telat lagi!!", "example: do not be late again!!"],
  ["UNTUK:", "TO:"], ["KAPAN:", "WHEN:"], ["Untuk:", "To:"], ["Dari:", "From:"],
  ["UNTUK", "FOR"], ["KAPAN", "WHEN"], ["ACARA", "EVENT"], ["Untuk", "For"], ["Dari", "From"],
  ["Jangan lupa istirahat yang cukup yaa...", "Do not forget to get enough rest..."],
  ["Sabtu, 14 Februari 2026", "Saturday, February 14, 2026"]
];

const DICTIONARY = PAIRS.reduce<Record<string, { id: string; en: string }>>((dictionary, [id, en]) => {
  // Some gift copy existed in reverse order before the locale layer was added.
  // Preserve the first canonical pair so a later duplicate cannot undo a translation.
  if (!dictionary[id]) dictionary[id] = { id, en };
  if (!dictionary[en]) dictionary[en] = { id, en };
  return dictionary;
}, {});

export function translateLocaleValue(value: string, locale: Locale): string {
  return DICTIONARY[value]?.[locale] || value;
}

export function translateStaticDom(root: HTMLElement | null, locale: Locale) {
  if (!root) return;
  const translate = (value: string) => translateLocaleValue(value, locale);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    const parent = node.parentElement;
    if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(parent.tagName) || parent.isContentEditable) continue;
    const source = node.nodeValue || "";
    const key = source.replace(/\s+/g, " ").trim();
    const translated = translate(key);
    if (translated !== key) node.nodeValue = source.replace(key, translated);
  }
  root.querySelectorAll<HTMLElement>("[placeholder], [title], [aria-label]").forEach((element) => {
    ["placeholder", "title", "aria-label"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value) {
        const trans = translate(value);
        if (trans !== value) element.setAttribute(attribute, trans);
      }
    });
  });
}

export function observeStaticDom(root: HTMLElement | null, locale: Locale) {
  if (!root || typeof window === "undefined") return () => {};

  let isTranslating = false;
  let rafId: number | null = null;
  const pendingNodes = new Set<HTMLElement>();

  const observer = new MutationObserver((mutations) => {
    if (isTranslating) return;

    let hasAdded = false;
    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i];
      for (let j = 0; j < m.addedNodes.length; j++) {
        const node = m.addedNodes[j];
        if (node.nodeType === Node.ELEMENT_NODE) {
          pendingNodes.add(node as HTMLElement);
          hasAdded = true;
        } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
          pendingNodes.add(node.parentElement);
          hasAdded = true;
        }
      }
    }

    if (hasAdded) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        isTranslating = true;
        try {
          pendingNodes.forEach((target) => {
            if (document.body.contains(target)) {
              translateStaticDom(target, locale);
            }
          });
          pendingNodes.clear();
        } finally {
          isTranslating = false;
        }
      });
    }
  });

  observer.observe(root, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
    pendingNodes.clear();
  };
}

