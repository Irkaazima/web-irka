window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

let selectedHotel = { nama: '', harga: 0 };

function formatRupiah(angka) {
    return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

function loginUser(event) {
    event.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!nama || !email) {
        alert('Nama dan email wajib diisi ya.');
        return;
    }

    localStorage.setItem('stayease_user', nama);
    localStorage.setItem('stayease_email', email);

    document.querySelectorAll('#userLogin').forEach(el => {
        el.innerHTML = '<i class="fas fa-user-circle"></i> ' + nama;
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (modal) modal.hide();

    alert('Login berhasil. Selamat datang, ' + nama + '!');
}

window.addEventListener('load', function() {
    const savedUser = localStorage.getItem('stayease_user');
    if (savedUser) {
        document.querySelectorAll('#userLogin').forEach(el => {
            el.innerHTML = '<i class="fas fa-user-circle"></i> ' + savedUser;
        });
    }

    const malam = document.getElementById('bookingMalam');
    if (malam) malam.addEventListener('change', updateBookingTotal);
});

function bookingHotel(namaHotel, harga) {
    selectedHotel = { nama: namaHotel, harga: Number(harga) };

    const savedUser = localStorage.getItem('stayease_user') || '';
    const bookingNama = document.getElementById('bookingNama');
    if (bookingNama && savedUser) bookingNama.value = savedUser;

    document.getElementById('bookingHotelName').textContent = namaHotel;
    document.getElementById('bookingHotelPrice').textContent = formatRupiah(harga) + ' / malam';

    const today = new Date().toISOString().split('T')[0];
    const checkin = document.getElementById('bookingCheckin');
    if (checkin) checkin.min = today;

    updateBookingTotal();
    new bootstrap.Modal(document.getElementById('bookingModal')).show();
}

function updateBookingTotal() {
    const malam = Number(document.getElementById('bookingMalam')?.value || 1);
    const total = selectedHotel.harga * malam;
    const totalEl = document.getElementById('bookingTotal');
    if (totalEl) totalEl.textContent = formatRupiah(total);
}

function submitBooking(event) {
    event.preventDefault();

    const nama = document.getElementById('bookingNama').value.trim();
    const hp = document.getElementById('bookingHp').value.trim();
    const checkin = document.getElementById('bookingCheckin').value;
    const malam = Number(document.getElementById('bookingMalam').value);
    const tamu = document.getElementById('bookingTamu').value;
    const bayar = document.getElementById('bookingBayar').value;
    const total = selectedHotel.harga * malam;

    if (!nama || !hp || !checkin) {
        alert('Lengkapi data booking dulu ya.');
        return;
    }

    localStorage.setItem('stayease_user', nama);
    document.querySelectorAll('#userLogin').forEach(el => {
        el.innerHTML = '<i class="fas fa-user-circle"></i> ' + nama;
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
    if (modal) modal.hide();

    alert(
        'Booking berhasil dibuat!\n\n' +
        'Nama: ' + nama + '\n' +
        'Hotel/Villa: ' + selectedHotel.nama + '\n' +
        'Check-in: ' + checkin + '\n' +
        'Lama menginap: ' + malam + ' malam\n' +
        'Jumlah tamu: ' + tamu + ' orang\n' +
        'Pembayaran: ' + bayar + '\n' +
        'Total: ' + formatRupiah(total) + '\n\n' +
        'Ini masih simulasi ya, tapi alurnya sudah seperti booking asli.'
    );

    event.target.reset();
    selectedHotel = { nama: '', harga: 0 };
}

function showTestimoni(nama, info, isi) {
    document.getElementById('testimoniNama').textContent = nama;
    document.getElementById('testimoniIsi').textContent = '"' + isi + '"';
    document.getElementById('testimoniInfo').textContent = info;
    new bootstrap.Modal(document.getElementById('testimoniModal')).show();
}

function showFacility(judul, isi) {
    document.getElementById('facilityTitle').innerHTML = '<i class="fas fa-star text-warning"></i> ' + judul;
    document.getElementById('facilityText').textContent = isi;
    new bootstrap.Modal(document.getElementById('facilityModal')).show();
}

function searchHotel(event) {
    event.preventDefault();
    alert('Anda akan diarahkan ke halaman katalog untuk memilih hotel.');
    window.location.href = 'katalog.html';
}

function filterHotels() {
    const kategori = document.getElementById('filterKategori')?.value || 'all';
    const harga = document.getElementById('filterHarga')?.value || 'all';
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const grid = document.getElementById('hotelGrid');
    const items = Array.from(document.querySelectorAll('.hotel-item'));

    let filtered = items.filter(item => {
        const itemCategory = item.getAttribute('data-category');
        const itemName = item.querySelector('h5').textContent.toLowerCase();
        return (kategori === 'all' || itemCategory === kategori) && itemName.includes(search);
    });

    if (harga === 'low') {
        filtered.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    } else if (harga === 'high') {
        filtered.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
    }

    items.forEach(item => item.style.display = 'none');
    filtered.forEach(item => {
        item.style.display = 'block';
        if (grid) grid.appendChild(item);
    });
}

function submitContactForm(event) {
    event.preventDefault();
    const nama = document.getElementById('contactNama')?.value || 'Tamu';
    alert('Terima kasih, ' + nama + '. Pesan Anda sudah terkirim dan akan kami balas secepatnya.');
    event.target.reset();
}

function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    alert('Email ' + email + ' sudah terdaftar. Terima kasih sudah subscribe.');
    event.target.reset();
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

window.addEventListener('load', function() {
    document.querySelectorAll('.hotel-card, .facility-card, .testimonial-card, .contact-info-item').forEach(el => {
        el.classList.add('fade-in', 'visible');
    });
});

