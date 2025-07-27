// Database simulation with localStorage persistence
let users = JSON.parse(localStorage.getItem('libraryUsers')) || [
    { 
        username: 'admin', 
        password: 'password123',
        email: 'admin@digitallibrary.id',
        fullName: 'Administrator'
    }
];

let borrowers = JSON.parse(localStorage.getItem('libraryBorrowers')) || [];
let books = JSON.parse(localStorage.getItem('libraryBooks')) || generateBookData();

let currentUser = null;

// Generate 1000 books data
function generateBookData() {
    const genres = ['Fiksi', 'Non-Fiksi', 'Sains', 'Teknologi', 'Sejarah', 'Biografi', 'Fantasi', 'Misteri', 'Romance', 'Bisnis'];
    const authors = [
        'Andrea Hirata', 'Pramoedya Ananta Toer', 'Dee Lestari', 'Tere Liye', 'Eka Kurniawan',
        'Ahmad Fuadi', 'Habiburrahman El Shirazy', 'Asma Nadia', 'Leila S. Chudori', 'Ayu Utami',
        'Erik Wright', 'Sarah Johnson', 'Michael Chen', 'David Miller', 'Lisa Wong',
        'John Smith', 'Emily Davis', 'Robert Brown', 'Jennifer Wilson', 'William Taylor'
    ];
    
    const bookTitles = [
        'Pemrograman JavaScript Modern', 'Seni Desain Web', 'Algoritma dan Struktur Data', 
        'Pengembangan Aplikasi Web', 'Machine Learning Dasar', 'Dasar-dasar Python',
        'Belajar React dari Nol', 'Node.js untuk Pemula', 'Database Modern', 'Sistem Operasi Lanjut',
        'Laskar Pelangi', 'Bumi Manusia', 'Perahu Kertas', 'Pulang', 'Cantik Itu Luka',
        'Negeri 5 Menara', 'Ayat-Ayat Cinta', 'Assalamualaikum Beijing', 'Pudarnya Pesona Cleopatra', 'Saman',
        'The Great Gatsby', 'To Kill a Mockingbird', '1984', 'Pride and Prejudice', 'The Catcher in the Rye',
        'Harry Potter', 'Lord of the Rings', 'The Hobbit', 'Game of Thrones', 'The Hunger Games'
    ];
    
    const generatedBooks = [];
    const usedTitles = new Set();
    
    for (let i = 1; i <= 1000; i++) {
        // Ensure unique titles by adding a number if duplicate
        let title;
        let attempts = 0;
        do {
            const baseTitle = bookTitles[Math.floor(Math.random() * bookTitles.length)];
            title = attempts > 0 ? `${baseTitle} ${i}` : baseTitle;
            attempts++;
        } while (usedTitles.has(title) && attempts < 5);
        
        usedTitles.add(title);
        
        generatedBooks.push({
            id: i,
            title: title,
            author: authors[Math.floor(Math.random() * authors.length)],
            year: Math.floor(Math.random() * 24) + 2000, // Random year between 2000-2023
            genre: genres[Math.floor(Math.random() * genres.length)],
            available: Math.random() > 0.3, // 70% chance of being available
            pages: Math.floor(Math.random() * 500) + 100 // Random pages between 100-600
        });
    }
    
    return generatedBooks;
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('libraryUsers', JSON.stringify(users));
    localStorage.setItem('libraryBorrowers', JSON.stringify(borrowers));
    localStorage.setItem('libraryBooks', JSON.stringify(books));
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('borrow-date').value = today;
    
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 7);
    document.getElementById('return-date').value = returnDate.toISOString().split('T')[0];
    
    // Event listeners
    document.getElementById('borrow-duration').addEventListener('change', updateReturnDate);
    document.getElementById('return-date').addEventListener('change', updateDuration);
    document.getElementById('search-book').addEventListener('input', searchBooks);
    
    // Initialize book catalog if empty
    if (books.length === 0) {
        books = generateBookData();
        saveData();
    }
});

// Update return date based on duration
function updateReturnDate() {
    const duration = parseInt(document.getElementById('borrow-duration').value);
    const borrowDate = new Date(document.getElementById('borrow-date').value);
    const returnDate = new Date(borrowDate);
    returnDate.setDate(returnDate.getDate() + duration);
    document.getElementById('return-date').value = returnDate.toISOString().split('T')[0];
}

// Update duration based on return date
function updateDuration() {
    const borrowDate = new Date(document.getElementById('borrow-date').value);
    const returnDate = new Date(document.getElementById('return-date').value);
    const duration = Math.round((returnDate - borrowDate) / (1000 * 60 * 60 * 24));
    document.getElementById('borrow-duration').value = duration > 0 ? duration : 1;
}

// Search books with pagination
function searchBooks() {
    const searchTerm = document.getElementById('search-book').value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm) ||
        (book.genre && book.genre.toLowerCase().includes(searchTerm))
    );
    renderBookCatalog(filteredBooks);
}

// Show register form
function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('register-result').innerHTML = '';
}

// Show login form
function showLogin() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('result').innerHTML = '';
}

// Validate login
function validateLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const resultDiv = document.getElementById('result');

    if(username === '' || password === '') {
        resultDiv.innerHTML = '<div class="text-danger">Harap isi semua field!</div>';
        return;
    }

    const user = users.find(u => 
        (u.username === username || u.email === username) && 
        u.password === password
    );
    
    if(user) {
        currentUser = user;
        resultDiv.innerHTML = '<div class="text-success">Login berhasil! Mengarahkan ke dashboard...</div>';
        
        // Update user avatar
        document.getElementById('user-avatar').textContent = 
            user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase();
        
        setTimeout(() => {
            showDashboard();
        }, 1000);
    } else {
        resultDiv.innerHTML = '<div class="text-danger">Username/email atau password salah!</div>';
    }
}

// Register new user
function registerUser() {
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const password2 = document.getElementById('reg-password2').value.trim();
    const regResultDiv = document.getElementById('register-result');

    // Validation
    if(username === '' || email === '' || password === '' || password2 === '') {
        regResultDiv.innerHTML = '<div class="text-danger">Harap isi semua field!</div>';
        return;
    }
    
    if(password.length < 6) {
        regResultDiv.innerHTML = '<div class="text-danger">Password minimal 6 karakter!</div>';
        return;
    }
    
    if(password !== password2) {
        regResultDiv.innerHTML = '<div class="text-danger">Password tidak sama!</div>';
        return;
    }
    
    if(users.find(u => u.username === username)) {
        regResultDiv.innerHTML = '<div class="text-danger">Username sudah terdaftar!</div>';
        return;
    }
    
    if(users.find(u => u.email === email)) {
        regResultDiv.innerHTML = '<div class="text-danger">Email sudah terdaftar!</div>';
        return;
    }
    
    if(!document.getElementById('agreeTerms').checked) {
        regResultDiv.innerHTML = '<div class="text-danger">Anda harus menyetujui syarat dan ketentuan!</div>';
        return;
    }

    // Add new user
    const newUser = { 
        username, 
        email,
        password,
        fullName: username 
    };
    
    users.push(newUser);
    saveData();
    
    regResultDiv.innerHTML = '<div class="text-success">Registrasi berhasil! Silakan login.</div>';
    setTimeout(() => {
        showLogin();
        document.getElementById('result').innerHTML = '<div class="text-success">Registrasi berhasil! Silakan login.</div>';
    }, 1500);
}

// Show dashboard
function showDashboard() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
    document.getElementById('borrowers-data').classList.add('hidden');
    document.getElementById('borrowed-books-data').classList.add('hidden');
    document.getElementById('book-catalog').classList.add('hidden');
    
    // Update stats
    updateDashboardStats();
    renderRecentActivity();
}

// Update dashboard statistics
function updateDashboardStats() {
    document.getElementById('total-books').textContent = books.length;
    document.getElementById('active-loans').textContent = borrowers.filter(b => b.status !== 'returned').length;
    
    // Calculate pending returns (within 3 days of due date)
    const today = new Date();
    const pendingReturns = borrowers.filter(loan => {
        if (loan.status === 'returned') return false;
        
        const returnDate = new Date(loan.date);
        returnDate.setDate(returnDate.getDate() + loan.duration);
        const daysLeft = Math.round((returnDate - today) / (1000 * 60 * 60 * 24));
        return daysLeft <= 3 && daysLeft >= 0;
    }).length;
    
    document.getElementById('pending-returns').textContent = pendingReturns;
    
    // Calculate overdue books
    const overdueBooks = borrowers.filter(loan => {
        if (loan.status === 'returned') return false;
        
        const returnDate = new Date(loan.date);
        returnDate.setDate(returnDate.getDate() + loan.duration);
        return returnDate < today;
    }).length;
    
    document.getElementById('overdue-books').textContent = overdueBooks;
}

// Show borrowers data
function showBorrowers() {
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('borrowers-data').classList.remove('hidden');
    renderBorrowersTable();
}

// Show borrowed books
function showBorrowedBooks() {
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('borrowed-books-data').classList.remove('hidden');
    renderBooksTable();
}

// Show book catalog
function showBookCatalog() {
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('book-catalog').classList.remove('hidden');
    renderBookCatalog(books);
}

// Submit book loan
function submitBorrow() {
    const bookTitle = document.getElementById('borrow-book').value.trim();
    const bookAuthor = document.getElementById('book-author').value.trim();
    const borrowDate = document.getElementById('borrow-date').value;
    const returnDate = document.getElementById('return-date').value;
    const duration = parseInt(document.getElementById('borrow-duration').value);
    const notes = document.getElementById('borrow-notes').value.trim();
    const borrowResultDiv = document.getElementById('borrow-result');

    if(bookTitle === '' || bookAuthor === '' || borrowDate === '' || returnDate === '' || isNaN(duration)) {
        borrowResultDiv.innerHTML = '<div class="text-danger">Harap isi semua field dengan benar!</div>';
        return;
    }
    
    if(duration < 1) {
        borrowResultDiv.innerHTML = '<div class="text-danger">Lama peminjaman minimal 1 hari!</div>';
        return;
    }

    // Add to borrowers
    const newLoan = {
        id: borrowers.length > 0 ? Math.max(...borrowers.map(b => b.id)) + 1 : 1,
        book: bookTitle,
        author: bookAuthor,
        date: borrowDate,
        returnDate: returnDate,
        duration: duration,
        notes: notes,
        status: 'active',
        borrower: currentUser.username
    };
    
    borrowers.push(newLoan);
    
    // Mark book as unavailable if it exists in catalog
    const bookIndex = books.findIndex(b => b.title.toLowerCase() === bookTitle.toLowerCase());
    if(bookIndex !== -1) {
        books[bookIndex].available = false;
    }

    saveData();
    borrowResultDiv.innerHTML = '<div class="text-success">Peminjaman berhasil diajukan!</div>';
    
    // Update dashboard
    setTimeout(() => {
        updateDashboardStats();
        renderRecentActivity();
        showDashboard();
    }, 1000);
}

// Render borrowers table
function renderBorrowersTable() {
    const tableDiv = document.getElementById('borrowers-table');
    
    if(borrowers.length === 0) {
        tableDiv.innerHTML = '<div class="text-center py-4">Belum ada data peminjam.</div>';
        return;
    }
    
    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Judul Buku</th>
                    <th>Peminjam</th>
                    <th>Tanggal Pinjam</th>
                    <th>Tanggal Kembali</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    borrowers.forEach((loan, index) => {
        const today = new Date();
        const dueDate = new Date(loan.date);
        dueDate.setDate(dueDate.getDate() + loan.duration);
        
        let statusClass = 'status-active';
        let statusText = 'Aktif';
        
        if (loan.status === 'returned') {
            statusClass = 'status-returned';
            statusText = 'Dikembalikan';
        } else if (dueDate < today) {
            statusClass = 'status-overdue';
            statusText = 'Terlambat';
        }
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${loan.book}</td>
                <td>${loan.borrower}</td>
                <td>${formatDate(loan.date)}</td>
                <td>${formatDate(loan.returnDate)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    tableDiv.innerHTML = html;
}

// Render books table
function renderBooksTable() {
    const tableDiv = document.getElementById('books-table');
    
    const activeLoans = borrowers.filter(loan => loan.status !== 'returned');
    
    if(activeLoans.length === 0) {
        tableDiv.innerHTML = '<div class="text-center py-4">Belum ada buku yang dipinjam.</div>';
        return;
    }
    
    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Judul Buku</th>
                    <th>Pengarang</th>
                    <th>Tanggal Pinjam</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    activeLoans.forEach((loan, index) => {
        const today = new Date();
        const dueDate = new Date(loan.date);
        dueDate.setDate(dueDate.getDate() + loan.duration);
        
        let statusClass = 'status-active';
        let statusText = 'Aktif';
        
        if (dueDate < today) {
            statusClass = 'status-overdue';
            statusText = 'Terlambat';
        }
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${loan.book}</td>
                <td>${loan.author}</td>
                <td>${formatDate(loan.date)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn btn-view" onclick="viewLoanDetails(${loan.id})"><i class="fas fa-eye"></i> Lihat</button>
                    <button class="action-btn btn-edit" onclick="returnBook(${loan.id})"><i class="fas fa-undo"></i> Kembalikan</button>
                </td>
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    tableDiv.innerHTML = html;
}

// Render book catalog with pagination
function renderBookCatalog(bookList = books) {
    const catalogBody = document.getElementById('catalog-body');
    
    if(bookList.length === 0) {
        catalogBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Tidak ada buku yang ditemukan.</td></tr>';
        return;
    }
    
    let html = '';
    
    bookList.forEach((book, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>
                    ${book.available ? 
                        '<span class="status-badge status-active">Tersedia</span>' : 
                        '<span class="status-badge status-overdue">Dipinjam</span>'
                    }
                </td>
                <td>
                    <button class="action-btn btn-view" onclick="viewBookDetails(${book.id})">
                        <i class="fas fa-eye"></i> Detail
                    </button>
                    ${book.available ? 
                        `<button class="action-btn btn-edit" onclick="borrowBook(${book.id})">
                            <i class="fas fa-book"></i> Pinjam
                        </button>` : 
                        ''
                    }
                </td>
            </tr>
        `;
    });
    
    catalogBody.innerHTML = html;
}

// Render recent activity
function renderRecentActivity() {
    const activityBody = document.getElementById('recent-activity-body');
    const recentLoans = [...borrowers]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5); // Get last 5 loans
    
    if(recentLoans.length === 0) {
        activityBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Belum ada aktivitas peminjaman.</td></tr>';
        return;
    }
    
    let html = '';
    
    recentLoans.forEach((loan, index) => {
        const today = new Date();
        const dueDate = new Date(loan.date);
        dueDate.setDate(dueDate.getDate() + loan.duration);
        
        let statusClass = 'status-active';
        let statusText = 'Aktif';
        
        if (loan.status === 'returned') {
            statusClass = 'status-returned';
            statusText = 'Dikembalikan';
        } else if (dueDate < today) {
            statusClass = 'status-overdue';
            statusText = 'Terlambat';
        }
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${loan.book}</td>
                <td>${formatDate(loan.date)}</td>
                <td>${formatDate(loan.returnDate)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn btn-view" onclick="viewLoanDetails(${loan.id})">
                        <i class="fas fa-info-circle"></i> Detail
                    </button>
                </td>
            </tr>
        `;
    });
    
    activityBody.innerHTML = html;
}

// View book details
function viewBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if(book) {
        let details = `Detail Buku:\n\nJudul: ${book.title}\nPengarang: ${book.author}\nTahun: ${book.year}\n`;
        details += `Genre: ${book.genre || 'Tidak diketahui'}\n`;
        details += `Halaman: ${book.pages || 'Tidak diketahui'}\n`;
        details += `Status: ${book.available ? 'Tersedia' : 'Dipinjam'}`;
        alert(details);
    }
}

// Borrow book from catalog
function borrowBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if(book) {
        document.getElementById('borrow-book').value = book.title;
        document.getElementById('book-author').value = book.author;
        showDashboard();
        document.getElementById('borrow-book').focus();
    }
}

// View loan details
function viewLoanDetails(loanId) {
    const loan = borrowers.find(l => l.id === loanId);
    if(loan) {
        const dueDate = new Date(loan.date);
        dueDate.setDate(dueDate.getDate() + loan.duration);
        
        let details = `Detail Peminjaman:\n\nJudul: ${loan.book}\n`;
        details += `Peminjam: ${loan.borrower}\n`;
        details += `Tanggal Pinjam: ${formatDate(loan.date)}\n`;
        details += `Tanggal Kembali: ${formatDate(loan.returnDate)}\n`;
        details += `Jatuh Tempo: ${formatDate(dueDate)}\n`;
        details += `Status: ${loan.status === 'returned' ? 'Dikembalikan' : 'Aktif'}\n`;
        details += `Catatan: ${loan.notes || '-'}`;
        
        alert(details);
    }
}

// Return book
function returnBook(loanId) {
    const loanIndex = borrowers.findIndex(l => l.id === loanId);
    if(loanIndex !== -1) {
        borrowers[loanIndex].status = 'returned';
        
        // Mark book as available if it exists in catalog
        const bookIndex = books.findIndex(b => b.title.toLowerCase() === borrowers[loanIndex].book.toLowerCase());
        if(bookIndex !== -1) {
            books[bookIndex].available = true;
        }
        
        saveData();
        alert(`Buku "${borrowers[loanIndex].book}" telah berhasil dikembalikan.`);
        renderBooksTable();
        updateDashboardStats();
        renderRecentActivity();
    }
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('result').innerHTML = '';
}