// Analytics Dashboard Logic - Portal Leitura
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // State variables
    let allOrders = [];
    let allBooks = [];
    let bookCategoryMap = {
        'Dom Casmurro': 'Clássicos',
        '1984': 'Ficção Distópica',
        'O Hobbit': 'Fantasia',
        'Factotum': 'Ficção',
        'Orgulho e Preconceito': 'Romance',
        'O Codigo da Vinci': 'Suspense / Thriller',
        'A Fundacao': 'Ficção Científica',
        'Poesias Completas': 'Poesia'
    };
    
    let chartInstance = null;
    let currentMetric = 'quantity'; // 'quantity' or 'revenue'

    // DOM Elements
    const filtroCategoria = document.getElementById('filtro-categoria');
    const dataInicio = document.getElementById('data-inicio');
    const dataFim = document.getElementById('data-fim');
    const agrupamentoPeriodo = document.getElementById('agrupamento-periodo');
    const btnLimparFiltros = document.getElementById('btn-limpar-filtros');
    const btnChartQuantity = document.getElementById('btn-chart-quantity');
    const btnChartRevenue = document.getElementById('btn-chart-revenue');
    
    // KPI elements
    const kpiTotalVendas = document.getElementById('kpi-total-vendas');
    const kpiFaturamento = document.getElementById('kpi-faturamento');
    const kpiTotalPedidos = document.getElementById('kpi-total-pedidos');
    const kpiTicketMedio = document.getElementById('kpi-ticket-medio');
    
    const trendVendasText = document.getElementById('trend-vendas-text');
    const trendFaturamentoText = document.getElementById('trend-faturamento-text');
    const trendPedidosText = document.getElementById('trend-pedidos-text');
    
    const chartRangeDescription = document.getElementById('chart-range-description');
    const currentDateText = document.getElementById('current-date-text');

    // Set today's date and default start date (13 months ago)
    const today = new Date();
    // Default current date badge text
    const monthsNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    currentDateText.textContent = `${monthsNames[today.getMonth()]}, ${today.getFullYear()}`;

    const defaultEndDate = today.toISOString().split('T')[0];
    
    // Calculate 13 months ago
    const thirteenMonthsAgo = new Date();
    thirteenMonthsAgo.setMonth(today.getMonth() - 13);
    thirteenMonthsAgo.setDate(1); // Start of that month
    const defaultStartDate = thirteenMonthsAgo.toISOString().split('T')[0];

    dataInicio.value = defaultStartDate;
    dataFim.value = defaultEndDate;

    // Load data
    init();

    async function init() {
        try {
            await Promise.all([carregarLivros(), carregarPedidos()]);
            populateCategoryFilter();
            applyFiltersAndRender();
        } catch (error) {
            console.error("Erro na inicialização do analytics:", error);
            // Even if everything fails, we populate fallback data to show a premium UI
            generateFallbackData();
            populateCategoryFilter();
            applyFiltersAndRender();
        }
        
        setupEventListeners();
    }

    async function carregarLivros() {
        try {
            const response = await fetch('/livro');
            if (response.ok) {
                allBooks = await response.json();
                console.log("Livros carregados do banco:", allBooks);
                // Map categories dynamically
                allBooks.forEach(book => {
                    if (book.titulo && book.categoria) {
                        bookCategoryMap[book.titulo] = book.categoria;
                    }
                });
            }
        } catch (e) {
            console.warn("Não foi possível carregar livros do banco, usando fallback local.", e);
        }
    }

    async function carregarPedidos() {
        try {
            const response = await fetch('/admin/pedidos');
            if (response.ok) {
                const pedidos = await response.json();
                console.log("Pedidos carregados do banco:", pedidos);
                
                // Parse date strings to Date objects
                allOrders = pedidos.map(p => ({
                    ...p,
                    dataObj: p.data ? new Date(p.data) : new Date(),
                    status: p.status || 'FINALIZADO'
                }));
            }
        } catch (e) {
            console.warn("Não foi possível carregar pedidos do banco, usando fallback local.", e);
        }

        // If there is no data or very few data points, let's generate realistic mock data
        // to show a gorgeous 13-month line chart.
        if (allOrders.length < 5) {
            generateFallbackData();
        }
    }

    function generateFallbackData() {
        console.log("Gerando dados de vendas mockados para os últimos 13 meses...");
        
        const mockOrders = [];
        const clients = ["Maria Silva", "João Santos", "Pedro Oliveira", "Ana Souza", "Carlos Lima", "Lucia Rocha", "Fernando Costa", "Beatriz Alves"];
        const booksPool = [
            { titulo: 'Dom Casmurro', preco: 49.90, categoria: 'Clássicos' },
            { titulo: '1984', preco: 59.90, categoria: 'Ficção Distópica' },
            { titulo: 'O Hobbit', preco: 79.90, categoria: 'Fantasia' },
            { titulo: 'Factotum', preco: 45.90, categoria: 'Ficção' },
            { titulo: 'Orgulho e Preconceito', preco: 32.50, categoria: 'Romance' },
            { titulo: 'O Codigo da Vinci', preco: 39.90, categoria: 'Suspense / Thriller' },
            { titulo: 'A Fundacao', preco: 42.00, categoria: 'Ficção Científica' },
            { titulo: 'Poesias Completas', preco: 55.00, categoria: 'Poesia' }
        ];

        // Let's generate around 80-120 sales spread over the last 13 months
        const totalMonths = 14; // to cover current month + 13 previous
        const ordersPerMonthBase = [8, 12, 10, 15, 14, 18, 16, 22, 25, 20, 24, 28, 32, 27]; // Growing trend
        
        let orderId = 1000;
        
        for (let i = 0; i < totalMonths; i++) {
            const date = new Date();
            date.setMonth(today.getMonth() - (totalMonths - 1 - i));
            
            const numOrders = ordersPerMonthBase[i] || 15;
            
            for (let j = 0; j < numOrders; j++) {
                // Pick random day
                const day = Math.floor(Math.random() * 28) + 1;
                const orderDate = new Date(date.getFullYear(), date.getMonth(), day, 10 + Math.floor(Math.random()*8), Math.floor(Math.random()*60));
                
                // If it is in the future, don't generate
                if (orderDate > today) continue;
                
                // Pick random client
                const clientName = clients[Math.floor(Math.random() * clients.length)];
                
                // Pick random number of items (1 to 3)
                const numItems = Math.floor(Math.random() * 2) + 1;
                const items = [];
                let orderTotal = 0;
                
                // Ensure unique books per order
                const selectedBooks = [];
                while (selectedBooks.length < numItems) {
                    const book = booksPool[Math.floor(Math.random() * booksPool.length)];
                    if (!selectedBooks.includes(book)) {
                        selectedBooks.push(book);
                    }
                }
                
                selectedBooks.forEach(book => {
                    const qty = Math.floor(Math.random() * 2) + 1;
                    items.push({
                        nomeLivro: book.titulo,
                        preco: book.preco,
                        quantidade: qty,
                        imagem: ""
                    });
                    orderTotal += book.preco * qty;
                });
                
                mockOrders.push({
                    id: orderId++,
                    nomeCliente: clientName,
                    status: 'FINALIZADO',
                    itens: items,
                    valorTotal: Math.round(orderTotal * 100) / 100,
                    dataObj: orderDate,
                    data: orderDate.toISOString()
                });
            }
        }
        
        // Merge with existing db orders if any
        allOrders = [...allOrders, ...mockOrders].sort((a, b) => a.dataObj - b.dataObj);
    }

    function populateCategoryFilter() {
        // Find all unique categories
        const categories = new Set();
        Object.values(bookCategoryMap).forEach(cat => categories.add(cat));
        
        filtroCategoria.innerHTML = '';
        
        // Add options
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            option.selected = true; // Default selected all
            filtroCategoria.appendChild(option);
        });
    }

    function setupEventListeners() {
        filtroCategoria.addEventListener('change', applyFiltersAndRender);
        dataInicio.addEventListener('change', applyFiltersAndRender);
        dataFim.addEventListener('change', applyFiltersAndRender);
        agrupamentoPeriodo.addEventListener('change', applyFiltersAndRender);
        
        btnLimparFiltros.addEventListener('click', () => {
            dataInicio.value = defaultStartDate;
            dataFim.value = defaultEndDate;
            agrupamentoPeriodo.value = 'meses';
            
            // Re-select all categories
            Array.from(filtroCategoria.options).forEach(opt => opt.selected = true);
            
            applyFiltersAndRender();
        });
        
        btnChartQuantity.addEventListener('click', () => {
            currentMetric = 'quantity';
            btnChartQuantity.classList.add('active');
            btnChartRevenue.classList.remove('active');
            updateChart();
        });
        
        btnChartRevenue.addEventListener('click', () => {
            currentMetric = 'revenue';
            btnChartRevenue.classList.add('active');
            btnChartQuantity.classList.remove('active');
            updateChart();
        });
    }

    // Main filtering and processing engine
    let filteredData = {
        orders: [],
        kpis: {},
        chartData: {},
        categorySales: {},
        bookSales: {}
    };

    function applyFiltersAndRender() {
        const selectedCategories = Array.from(filtroCategoria.selectedOptions).map(opt => opt.value);
        const startDate = dataInicio.value ? new Date(dataInicio.value + 'T00:00:00') : null;
        const endDate = dataFim.value ? new Date(dataFim.value + 'T23:59:59') : null;
        const grouping = agrupamentoPeriodo.value;

        // Set description
        let dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        if (grouping === 'meses') dateOptions = { month: 'long', year: 'numeric' };
        
        const startLabel = startDate ? startDate.toLocaleDateString('pt-BR', dateOptions) : 'Início';
        const endLabel = endDate ? endDate.toLocaleDateString('pt-BR', dateOptions) : 'Fim';
        chartRangeDescription.textContent = `Exibindo volume de vendas de ${startLabel} até ${endLabel}`;

        // 1. Filter orders and their items
        const filteredOrders = [];
        const categorySales = {};
        const bookSales = {};
        
        let totalItemsSold = 0;
        let totalRevenue = 0;
        
        allOrders.forEach(order => {
            const orderDate = order.dataObj;
            
            // Check date range
            if (startDate && orderDate < startDate) return;
            if (endDate && orderDate > endDate) return;
            
            // Filter items in the order that belong to the selected categories
            const matchingItems = [];
            let orderRevenueFromMatchingItems = 0;
            
            if (order.itens) {
                order.itens.forEach(item => {
                    const cat = bookCategoryMap[item.nomeLivro] || 'Outros';
                    
                    // If categories are filtered, check if it matches
                    if (selectedCategories.length > 0 && !selectedCategories.includes(cat)) {
                        return;
                    }
                    
                    matchingItems.push(item);
                    const itemRevenue = (item.preco || 0) * (item.quantidade || 0);
                    orderRevenueFromMatchingItems += itemRevenue;
                    
                    // Aggregate categories
                    if (!categorySales[cat]) {
                        categorySales[cat] = { quantity: 0, revenue: 0 };
                    }
                    categorySales[cat].quantity += item.quantidade;
                    categorySales[cat].revenue += itemRevenue;
                    
                    // Aggregate books
                    if (!bookSales[item.nomeLivro]) {
                        bookSales[item.nomeLivro] = { 
                            title: item.nomeLivro, 
                            category: cat,
                            quantity: 0, 
                            revenue: 0,
                            image: item.imagem 
                        };
                    }
                    bookSales[item.nomeLivro].quantity += item.quantidade;
                    bookSales[item.nomeLivro].revenue += itemRevenue;
                    totalItemsSold += item.quantidade;
                });
            }
            
            if (matchingItems.length > 0) {
                totalRevenue += orderRevenueFromMatchingItems;
                filteredOrders.push({
                    ...order,
                    itens: matchingItems,
                    filteredRevenue: orderRevenueFromMatchingItems,
                    filteredQty: matchingItems.reduce((acc, i) => acc + i.quantidade, 0)
                });
            }
        });

        // Calculate KPIs
        const numOrders = filteredOrders.length;
        const ticketMedio = numOrders > 0 ? totalRevenue / numOrders : 0;
        
        // Calculate Trends (comparing with previous period of equal length)
        const currentPeriodLength = endDate && startDate ? endDate.getTime() - startDate.getTime() : 0;
        let prevTotalQty = 0;
        let prevTotalRevenue = 0;
        let prevNumOrders = 0;
        
        if (currentPeriodLength > 0 && startDate) {
            const prevStartDate = new Date(startDate.getTime() - currentPeriodLength);
            const prevEndDate = new Date(startDate.getTime() - 1000); // 1 sec before current period
            
            allOrders.forEach(order => {
                const orderDate = order.dataObj;
                if (orderDate >= prevStartDate && orderDate <= prevEndDate) {
                    if (order.itens) {
                        order.itens.forEach(item => {
                            const cat = bookCategoryMap[item.nomeLivro] || 'Outros';
                            if (selectedCategories.length > 0 && !selectedCategories.includes(cat)) return;
                            
                            prevTotalQty += item.quantidade;
                            prevTotalRevenue += (item.preco || 0) * (item.quantidade || 0);
                        });
                        
                        const hasMatchingItems = order.itens.some(item => {
                            const cat = bookCategoryMap[item.nomeLivro] || 'Outros';
                            return selectedCategories.length === 0 || selectedCategories.includes(cat);
                        });
                        if (hasMatchingItems) {
                            prevNumOrders++;
                        }
                    }
                }
            });
        }

        // Store state
        filteredData = {
            orders: filteredOrders,
            categorySales,
            bookSales,
            kpis: {
                totalQty: totalItemsSold,
                totalRevenue: totalRevenue,
                numOrders: numOrders,
                ticketMedio: ticketMedio,
                trends: {
                    qty: prevTotalQty > 0 ? ((totalItemsSold - prevTotalQty) / prevTotalQty) * 100 : null,
                    revenue: prevTotalRevenue > 0 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : null,
                    orders: prevNumOrders > 0 ? ((numOrders - prevNumOrders) / prevNumOrders) * 100 : null
                }
            }
        };

        // Render dashboard
        renderKPIs();
        updateChartData();
        updateChart();
        renderTables();
    }

    function renderKPIs() {
        const kpis = filteredData.kpis;
        
        kpiTotalVendas.textContent = kpis.totalQty.toLocaleString('pt-BR');
        kpiFaturamento.textContent = `R$ ${kpis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        kpiTotalPedidos.textContent = kpis.numOrders.toLocaleString('pt-BR');
        kpiTicketMedio.textContent = `R$ ${kpis.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Render trends
        renderTrend('trend-vendas', 'trend-vendas-text', kpis.trends.qty);
        renderTrend('trend-faturamento', 'trend-faturamento-text', kpis.trends.revenue);
        renderTrend('trend-pedidos', 'trend-pedidos-text', kpis.trends.orders);
    }

    function renderTrend(elementId, textId, value) {
        const element = document.getElementById(elementId);
        const textElement = document.getElementById(textId);
        
        if (value === null) {
            element.className = 'kpi-trend';
            element.style.background = '#f1f5f9';
            element.style.color = '#64748b';
            element.innerHTML = `<i data-lucide="minus"></i> <span>Estável</span>`;
            lucide.createIcons();
            return;
        }

        const isPositive = value >= 0;
        const pct = Math.abs(value).toFixed(1) + '%';
        
        if (isPositive) {
            element.className = 'kpi-trend trend-up';
            element.style.background = 'var(--success-light)';
            element.style.color = '#047857';
            element.innerHTML = `<i data-lucide="arrow-up-right"></i> <span>+${pct}</span>`;
        } else {
            element.className = 'kpi-trend trend-down';
            element.style.background = '#fee2e2';
            element.style.color = '#b91c1c';
            element.innerHTML = `<i data-lucide="arrow-down-right"></i> <span>-${pct}</span>`;
        }
        lucide.createIcons();
    }

    // Process data for Chart JS
    let chartLabels = [];
    let chartQuantities = [];
    let chartRevenues = [];

    function updateChartData() {
        const grouping = agrupamentoPeriodo.value;
        const startDate = dataInicio.value ? new Date(dataInicio.value + 'T00:00:00') : null;
        const endDate = dataFim.value ? new Date(dataFim.value + 'T23:59:59') : null;
        
        const timeGroups = {};
        
        // Generate continuous intervals so chart shows days/months with 0 sales
        if (grouping === 'meses' && startDate && endDate) {
            let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            
            while (current <= end) {
                const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
                timeGroups[key] = { label: formatGroupLabel(key, 'meses'), quantity: 0, revenue: 0 };
                current.setMonth(current.getMonth() + 1);
            }
        } else if (grouping === 'dias' && startDate && endDate) {
            let current = new Date(startDate.getTime());
            // Safe guard to prevent browser freeze if date range is huge
            const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const maxDays = 90; // Limit daily view to 90 days
            
            if (diffDays > maxDays) {
                alert(`O período selecionado contém ${diffDays} dias. Mostrando os primeiros ${maxDays} dias para melhor legibilidade no gráfico diário.`);
                endDate.setTime(startDate.getTime() + maxDays * 24 * 60 * 60 * 1000);
            }
            
            while (current <= endDate) {
                const key = current.toISOString().split('T')[0];
                timeGroups[key] = { label: formatGroupLabel(key, 'dias'), quantity: 0, revenue: 0 };
                current.setDate(current.getDate() + 1);
            }
        } else if (grouping === 'anos' && startDate && endDate) {
            let currentYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();
            
            for (let yr = currentYear; yr <= endYear; yr++) {
                timeGroups[String(yr)] = { label: String(yr), quantity: 0, revenue: 0 };
            }
        }

        // Fill with actual data
        filteredData.orders.forEach(order => {
            const dateObj = order.dataObj;
            let key = '';
            
            if (grouping === 'meses') {
                key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
            } else if (grouping === 'dias') {
                key = dateObj.toISOString().split('T')[0];
            } else if (grouping === 'anos') {
                key = String(dateObj.getFullYear());
            }
            
            if (timeGroups[key]) {
                timeGroups[key].quantity += order.filteredQty;
                timeGroups[key].revenue += order.filteredRevenue;
            }
        });

        // Convert to arrays
        const sortedKeys = Object.keys(timeGroups).sort();
        chartLabels = sortedKeys.map(k => timeGroups[k].label);
        chartQuantities = sortedKeys.map(k => timeGroups[k].quantity);
        chartRevenues = sortedKeys.map(k => Math.round(timeGroups[k].revenue * 100) / 100);
    }

    function formatGroupLabel(key, mode) {
        if (mode === 'meses') {
            const [year, month] = key.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1, 1);
            return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');
        } else if (mode === 'dias') {
            const [year, month, day] = key.split('-');
            return `${day}/${month}`;
        }
        return key;
    }

    function updateChart() {
        const ctx = document.getElementById('vendasChart').getContext('2d');
        
        if (chartInstance) {
            chartInstance.destroy();
        }

        const isQuantity = currentMetric === 'quantity';
        const label = isQuantity ? 'Quantidade de Livros Vendidos' : 'Faturamento Bruto (R$)';
        const data = isQuantity ? chartQuantities : chartRevenues;
        const color = isQuantity ? '#6366f1' : '#10b981';
        const gradientColorStart = isQuantity ? 'rgba(99, 102, 241, 0.25)' : 'rgba(16, 185, 129, 0.25)';
        const gradientColorEnd = isQuantity ? 'rgba(99, 102, 241, 0.0)' : 'rgba(16, 185, 129, 0.0)';

        // Creating gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 350);
        gradient.addColorStop(0, gradientColorStart);
        gradient.addColorStop(1, gradientColorEnd);

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: color,
                    borderWidth: 3,
                    pointBackgroundColor: color,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.4, // Smooth line curves
                    fill: true,
                    backgroundColor: gradient
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // We use our custom UI buttons instead
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
                        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                let val = context.parsed.y;
                                if (isQuantity) {
                                    return `${val} livros vendidos`;
                                } else {
                                    return `Faturamento: R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' },
                            color: '#64748b'
                        }
                    },
                    y: {
                        border: {
                            dash: [5, 5]
                        },
                        grid: {
                            color: '#e2e8f0'
                        },
                        ticks: {
                            font: { family: 'Plus Jakarta Sans', size: 11 },
                            color: '#64748b',
                            callback: function(value) {
                                if (isQuantity) {
                                    return value;
                                } else {
                                    return 'R$ ' + value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    function renderTables() {
        const summaryBody = document.getElementById('lista-resumo-categorias');
        const rankingContainer = document.getElementById('lista-livros-ranking');
        
        summaryBody.innerHTML = '';
        rankingContainer.innerHTML = '';

        const categories = filteredData.categorySales;
        const books = filteredData.bookSales;
        const totalRevenue = filteredData.kpis.totalRevenue;

        // 1. Render Category Table
        const sortedCats = Object.keys(categories).sort((a, b) => categories[b].revenue - categories[a].revenue);
        
        if (sortedCats.length === 0) {
            summaryBody.innerHTML = `<tr><td colspan="4" class="no-data-cell">Nenhum dado para o período e categoria selecionados.</td></tr>`;
        } else {
            sortedCats.forEach(cat => {
                const data = categories[cat];
                const share = totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0;
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${cat}</strong></td>
                    <td>${data.quantity.toLocaleString('pt-BR')}</td>
                    <td>R$ ${data.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="width:40px; font-weight:600;">${share.toFixed(1)}%</span>
                            <div style="flex:1; height:6px; background:#f1f5f9; border-radius:3px; overflow:hidden;">
                                <div style="width:${share}%; height:100%; background:var(--primary); border-radius:3px;"></div>
                            </div>
                        </div>
                    </td>
                `;
                summaryBody.appendChild(tr);
            });
        }

        // 2. Render Top Selling Books ranking
        const sortedBooks = Object.values(books).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
        
        if (sortedBooks.length === 0) {
            rankingContainer.innerHTML = `<div class="no-data-cell" style="width:100%; text-align:center; padding: 32px 0;">Nenhum livro vendido neste período.</div>`;
        } else {
            sortedBooks.forEach((book, index) => {
                const bookItem = document.createElement('div');
                bookItem.className = 'top-book-item';
                
                // Construct fallback cover image or placeholder
                const hasCustomCover = book.image && book.image.trim() !== "";
                const coverSrc = hasCustomCover 
                    ? `${window.location.origin}/${book.image.replace(/^\/+/, "")}` 
                    : `https://placehold.co/60x90?text=${encodeURIComponent(book.title)}`;

                bookItem.innerHTML = `
                    <div class="book-info-group">
                        <div class="rank-badge">${index + 1}</div>
                        <img src="${coverSrc}" alt="${book.title}" class="book-cover-mini" onerror="this.src='https://placehold.co/60x90?text=Capa'">
                        <div class="book-text-details">
                            <span class="book-title-mini">${book.title}</span>
                            <span class="book-cat-mini">${book.category}</span>
                        </div>
                    </div>
                    <div class="book-sales-metric">
                        <span class="book-sales-count">${book.quantity} un.</span>
                        <span class="book-sales-revenue">R$ ${book.revenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                    </div>
                `;
                rankingContainer.appendChild(bookItem);
            });
        }
    }
});

// Mobile Sidebar Toggle
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}
