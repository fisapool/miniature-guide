// JavaScript Papan Pemuka VPN
document.addEventListener('DOMContentLoaded', function() {
    semakStatusVPN();
    
    // Semak status setiap 30 saat
    setInterval(semakStatusVPN, 30000);
});

async function semakStatusVPN() {
    const elemenStatus = document.getElementById('vpn-status');
    
    try {
        const respons = await fetch('/api/vpn/status');
        const data = await respons.json();
        
        if (data.status === 'connected') {
            elemenStatus.innerHTML = `
                <span class="status-connected">✅ Bersambung</span>
                <br>
                <small>Server: ${data.server} | Lokasi: ${data.location}</small>
            `;
        } else {
            elemenStatus.innerHTML = '<span class="status-disconnected">❌ Terputus</span>';
        }
    } catch (ralat) {
        console.error('Ralat menyemak status VPN:', ralat);
        elemenStatus.innerHTML = '<span class="status-disconnected">⚠️ Ralat menyemak status</span>';
    }
}

// Semakan kesihatan untuk API
async function semakKesihatanAPI() {
    try {
        const respons = await fetch('/health');
        const data = await respons.json();
        console.log('Kesihatan API:', data);
    } catch (ralat) {
        console.error('Semakan kesihatan API gagal:', ralat);
    }
}

// Semakan kesihatan awal
semakKesihatanAPI();
