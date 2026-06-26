import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Product, Order, OrderStatus, WaitlistItem } from "../types";
import { 
  Plus, Trash, Edit, Check, X, ShieldAlert, Sparkles, ShoppingBag, 
  Store, DollarSign, TrendingUp, RefreshCw, Layers, MapPin, 
  Clock, Package, Star, Eye, EyeOff, ClipboardList, Rocket, Mail, Phone, Building, UserCheck, MessageSquare
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    categories, 
    orders, 
    branches, 
    shifts, 
    waitlist,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus,
    updateWaitlistStatus,
    deleteWaitlistProspect
  } = useApp();

  const [activeTab, setActiveTab] = useState<"sales" | "catalog" | "branches" | "waitlist">("sales");
  
  // Catalog Management States
  const [isAdding, setIsAdding] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("hamburguesas");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImg, setNewProdImg] = useState("");
  const [variantsList, setVariantsList] = useState<{ name: string; price: number }[]>([]);
  const [variantName, setVariantName] = useState("");
  const [variantPrice, setVariantPrice] = useState("");

  // Statistics calculation
  const totalSales = orders
    .filter(o => o.status === "completed" || o.status === "ready" || o.status === "preparing")
    .reduce((sum, o) => sum + o.total, 0);

  const completedOrdersCount = orders.filter(o => o.status === "completed").length;
  const activeOrdersCount = orders.filter(o => o.status !== "completed" && o.status !== "cancelled").length;

  const posSales = orders
    .filter(o => o.type === "pos" && (o.status === "completed" || o.status === "ready" || o.status === "preparing"))
    .reduce((sum, o) => sum + o.total, 0);

  const onlineSales = orders
    .filter(o => o.type === "online" && (o.status === "completed" || o.status === "ready" || o.status === "preparing"))
    .reduce((sum, o) => sum + o.total, 0);

  // Sales by Category calculation
  const salesByCategory = categories.reduce((acc, cat) => {
    let total = 0;
    orders.forEach(o => {
      if (o.status !== "cancelled") {
        o.items.forEach(item => {
          const prod = products.find(p => p.id === item.productId);
          if (prod && prod.category === cat.id) {
            total += (item.price + (item.selectedVariant?.price || 0)) * item.quantity;
          }
        });
      }
    });
    acc[cat.id] = total;
    return acc;
  }, {} as Record<string, number>);

  const handleAddVariant = () => {
    if (!variantName || !variantPrice) return;
    setVariantsList([...variantsList, { name: variantName, price: Number(variantPrice) || 0 }]);
    setVariantName("");
    setVariantPrice("");
  };

  const handleRemoveVariant = (index: number) => {
    setVariantsList(variantsList.filter((_, i) => i !== index));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const fallbackImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";

    if (editingProd) {
      updateProduct({
        ...editingProd,
        name: newProdName,
        price: Number(newProdPrice),
        category: newProdCategory,
        description: newProdDesc,
        image: newProdImg || fallbackImg,
        variants: variantsList
      });
      setEditingProd(null);
    } else {
      addProduct({
        name: newProdName,
        price: Number(newProdPrice),
        category: newProdCategory,
        description: newProdDesc,
        image: newProdImg || fallbackImg,
        variants: variantsList,
        isAvailable: true
      });
      setIsAdding(false);
    }

    // Reset Form
    setNewProdName("");
    setNewProdPrice("");
    setNewProdCategory("hamburguesas");
    setNewProdDesc("");
    setNewProdImg("");
    setVariantsList([]);
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProd(prod);
    setNewProdName(prod.name);
    setNewProdPrice(prod.price.toString());
    setNewProdCategory(prod.category);
    setNewProdDesc(prod.description);
    setNewProdImg(prod.image);
    setVariantsList(prod.variants || []);
    setIsAdding(true);
  };

  const handleCancelEdit = () => {
    setEditingProd(null);
    setIsAdding(false);
    setNewProdName("");
    setNewProdPrice("");
    setVariantsList([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in" id="admin-dashboard-view">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight font-sans">Panel de Control</h1>
          <p className="text-neutral-500 text-sm mt-1">Supervisa ventas, administra tu menú gastronómico y gestiona pedidos activos.</p>
        </div>
        
        {/* Tab Selector */}
        <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200 self-start md:self-center">
          <button
            onClick={() => setActiveTab("sales")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "sales" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Ventas y Pedidos
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "catalog" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            Catálogo Menú
          </button>
          <button
            onClick={() => setActiveTab("branches")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "branches" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Store className="w-4 h-4" />
            Sucursales
          </button>
          <button
            onClick={() => setActiveTab("waitlist")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "waitlist" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Rocket className="w-4 h-4" />
            Lista de Espera
          </button>
        </div>
      </div>

      {/* TAB 1: VENTAS Y PEDIDOS */}
      {activeTab === "sales" && (
        <div className="space-y-8">
          
          {/* KPI Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-bold tracking-wider uppercase">Ventas Netas Hoy</span>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-neutral-900 font-mono">
                  ${totalSales.toLocaleString("es-CL")}
                </h3>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3 h-3" /> +14.2% respecto a ayer
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-bold tracking-wider uppercase">Pedidos Activos</span>
                <ClipboardList className="w-5 h-5 text-blue-500" />
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-neutral-900 font-mono">
                  {activeOrdersCount}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">Órdenes en preparación o listas</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-bold tracking-wider uppercase">Canal de Venta POS</span>
                <Store className="w-5 h-5 text-neutral-600" />
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-neutral-900 font-mono">
                  ${posSales.toLocaleString("es-CL")}
                </h3>
                <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-neutral-900 h-full rounded-full" 
                    style={{ width: `${totalSales > 0 ? (posSales / totalSales) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-neutral-500 mt-1.5 flex justify-between">
                  <span>Presencial</span>
                  <span className="font-semibold">{totalSales > 0 ? Math.round((posSales / totalSales) * 100) : 0}%</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-bold tracking-wider uppercase">Canal de Venta Online</span>
                <ShoppingBag className="w-5 h-5 text-amber-500" />
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-neutral-900 font-mono">
                  ${onlineSales.toLocaleString("es-CL")}
                </h3>
                <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full" 
                    style={{ width: `${totalSales > 0 ? (onlineSales / totalSales) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-neutral-500 mt-1.5 flex justify-between">
                  <span>Ecommerce</span>
                  <span className="font-semibold">{totalSales > 0 ? Math.round((onlineSales / totalSales) * 100) : 0}%</span>
                </p>
              </div>
            </div>
          </div>

          {/* Analytical Charts and Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales by Category (CSS Chart) */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm lg:col-span-1">
              <h3 className="font-bold text-neutral-950 text-sm tracking-tight mb-4">Ventas por Categoría</h3>
              <div className="space-y-4">
                {(() => {
                  const salesValues: number[] = Object.values(salesByCategory);
                  const maxVal = Math.max(...salesValues, 1);
                  return categories.map(cat => {
                    const val = salesByCategory[cat.id] || 0;
                    const pct = Math.round((val / maxVal) * 100);
                    
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-neutral-600">
                          <span className="font-semibold">{cat.name}</span>
                          <span className="font-mono font-medium">${val.toLocaleString("es-CL")}</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-neutral-900 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Live Pipeline Order Manager */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-neutral-950 text-sm tracking-tight">Pipeline de Pedidos</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Controla y avanza el estado de los pedidos del local en tiempo real.</p>
                </div>
                <span className="bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] px-2 py-1 rounded font-mono font-bold">
                  Total: {orders.length} órdenes
                </span>
              </div>

              {/* Order Flow Grid / Pipeline */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 font-medium">Pedido ID</th>
                      <th className="pb-3 font-medium">Cliente / Tipo</th>
                      <th className="pb-3 font-medium">Sucursal</th>
                      <th className="pb-3 font-medium">Items</th>
                      <th className="pb-3 font-medium">Total</th>
                      <th className="pb-3 font-medium">Estado</th>
                      <th className="pb-3 font-medium text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {orders.map((o) => {
                      const statusColorMap: Record<OrderStatus, string> = {
                        pending: "bg-rose-50 text-rose-600 border-rose-200",
                        preparing: "bg-amber-50 text-amber-600 border-amber-200",
                        ready: "bg-blue-50 text-blue-600 border-blue-200",
                        completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
                        cancelled: "bg-neutral-50 text-neutral-400 border-neutral-200"
                      };

                      return (
                        <tr key={o.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-3.5 font-mono font-semibold text-neutral-800">{o.id}</td>
                          <td className="py-3.5">
                            <div className="font-semibold text-neutral-900">{o.customerName}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                                o.type === "pos" ? "bg-neutral-100 text-neutral-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {o.type === "pos" ? "POS / Mesa" : "Online"}
                              </span>
                              <span className="text-[10px] text-neutral-400">{o.tableNo}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-neutral-600 font-medium">{o.sucursalName.replace("FoodHub ", "")}</td>
                          <td className="py-3.5 text-neutral-600">
                            <div className="max-w-[200px] truncate" title={o.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}>
                              {o.items.map((i, idx) => (
                                <span key={idx} className="block text-[11px] text-neutral-700">
                                  {i.quantity}x {i.name} {i.selectedVariant ? `(${i.selectedVariant.name})` : ""}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 font-mono font-bold text-neutral-900">${o.total.toLocaleString("es-CL")}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold tracking-wide ${statusColorMap[o.status]}`}>
                              {o.status === "pending" && "Pendiente"}
                              {o.status === "preparing" && "Preparando"}
                              {o.status === "ready" && "Listo"}
                              {o.status === "completed" && "Entregado"}
                              {o.status === "cancelled" && "Cancelado"}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {o.status === "pending" && (
                                <button
                                  onClick={() => updateOrderStatus(o.id, "preparing")}
                                  className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                                >
                                  Preparar
                                </button>
                              )}
                              {o.status === "preparing" && (
                                <button
                                  onClick={() => updateOrderStatus(o.id, "ready")}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                                >
                                  Listo
                                </button>
                              )}
                              {o.status === "ready" && (
                                <button
                                  onClick={() => updateOrderStatus(o.id, "completed")}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                                >
                                  Entregar
                                </button>
                              )}
                              {o.status !== "completed" && o.status !== "cancelled" && (
                                <button
                                  onClick={() => updateOrderStatus(o.id, "cancelled")}
                                  title="Cancelar pedido"
                                  className="text-neutral-400 hover:text-rose-500 p-1 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GESTION DE CATALOGO MENU */}
      {activeTab === "catalog" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Catalog Operations bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-neutral-900 text-lg">Catálogo Gastronómico</h2>
              <p className="text-xs text-neutral-500">Agrega, edita y desactiva platos para todas tus sucursales.</p>
            </div>
            {!isAdding && (
              <button
                id="btn-add-product"
                onClick={() => {
                  setEditingProd(null);
                  setIsAdding(true);
                }}
                className="bg-neutral-950 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Agregar Plato
              </button>
            )}
          </div>

          {/* Formulario de Agregar / Editar Plato */}
          {isAdding && (
            <form onSubmit={handleSaveProduct} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  {editingProd ? `Editar Plato: ${editingProd.name}` : "Nuevo Plato del Menú"}
                </h3>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-neutral-400 hover:text-neutral-950 text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Fields */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Nombre del Plato *</label>
                    <input
                      id="input-prod-name"
                      type="text"
                      required
                      placeholder="Ej. Sándwich de Lomo Italiano"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700">Precio Base ($) *</label>
                      <input
                        id="input-prod-price"
                        type="number"
                        required
                        placeholder="7200"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-950 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700">Categoría *</label>
                      <select
                        id="select-prod-cat"
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-950 cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Descripción Gastronómica</label>
                    <textarea
                      id="textarea-prod-desc"
                      placeholder="Describe los ingredientes, texturas, cocción..."
                      rows={3}
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">URL de la Imagen</label>
                    <input
                      id="input-prod-img"
                      type="text"
                      placeholder="Deja en blanco para usar una imagen por defecto"
                      value={newProdImg}
                      onChange={(e) => setNewProdImg(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-950 text-neutral-600"
                    />
                  </div>
                </div>

                {/* Right Fields: Variants & Options */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-4">
                  <div>
                    <h4 className="font-semibold text-neutral-950 text-xs tracking-tight uppercase">Variantes y Opciones del Menú</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Permite a tus clientes elegir tamaños, niveles de cocción o agregar ingredientes extras.</p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej. Con Tocino o Doble Carne"
                      value={variantName}
                      onChange={(e) => setVariantName(e.target.value)}
                      className="flex-1 bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-950"
                    />
                    <input
                      type="number"
                      placeholder="Precio +$"
                      value={variantPrice}
                      onChange={(e) => setVariantPrice(e.target.value)}
                      className="w-24 bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-950 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="bg-neutral-950 text-white hover:bg-neutral-800 text-xs px-3 py-1.5 rounded-lg cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Registered Variants list */}
                  <div className="space-y-1 max-h-[160px] overflow-y-auto">
                    {variantsList.length === 0 ? (
                      <p className="text-neutral-400 text-xs italic">No hay variantes agregadas para este plato.</p>
                    ) : (
                      variantsList.map((v, i) => (
                        <div key={i} className="flex items-center justify-between bg-neutral-50 border border-neutral-100 p-2 rounded-lg text-xs">
                          <span className="font-medium text-neutral-700">{v.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-neutral-500 font-bold">+${v.price}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(i)}
                              className="text-neutral-400 hover:text-rose-500"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-neutral-950 text-white text-xs font-semibold px-5 py-2 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  {editingProd ? "Guardar Cambios" : "Guardar Nuevo Plato"}
                </button>
              </div>
            </form>
          )}

          {/* Grid de Productos */}
          <div className="space-y-12">
            {categories.map((cat) => {
              const catProducts = products.filter((p) => p.category === cat.id);
              
              return (
                <div key={cat.id} className="space-y-4">
                  <div className="border-b border-neutral-200 pb-2 flex items-center gap-2">
                    <span className="font-bold text-neutral-950 text-base">{cat.name}</span>
                    <span className="bg-neutral-100 text-neutral-500 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                      {catProducts.length} items
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catProducts.map((p) => (
                      <div 
                        key={p.id} 
                        className={`bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col justify-between transition-all ${
                          !p.isAvailable ? "opacity-60 bg-neutral-50/50" : "hover:border-neutral-300"
                        }`}
                      >
                        <div>
                          {/* Image and Availability Toggle overlay */}
                          <div className="relative h-44 bg-neutral-100">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-3 right-3 flex gap-1.5">
                              {/* Toggle Availability Button */}
                              <button
                                onClick={() => updateProduct({ ...p, isAvailable: !p.isAvailable })}
                                title={p.isAvailable ? "Marcar como no disponible" : "Marcar como disponible"}
                                className={`p-1.5 rounded-full backdrop-blur-md shadow-md border cursor-pointer transition-colors ${
                                  p.isAvailable 
                                    ? "bg-white/80 border-neutral-200 text-neutral-700 hover:text-rose-600" 
                                    : "bg-rose-500 border-rose-500 text-white"
                                }`}
                              >
                                {p.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div className="p-4 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-neutral-950 text-sm tracking-tight">{p.name}</h4>
                              <span className="font-mono font-bold text-neutral-900 text-sm">${p.price.toLocaleString("es-CL")}</span>
                            </div>
                            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{p.description}</p>
                            
                            {/* Short variant display */}
                            {p.variants && p.variants.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {p.variants.map((v, idx) => (
                                  <span key={idx} className="bg-neutral-100 text-neutral-600 text-[10px] px-2 py-0.5 rounded font-medium">
                                    {v.name} (+${v.price})
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Operations */}
                        <div className="p-4 pt-0 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            p.isAvailable ? "text-emerald-600" : "text-rose-500"
                          }`}>
                            {p.isAvailable ? "● Disponible" : "● Agotado"}
                          </span>
                          
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="text-neutral-500 hover:text-neutral-900 p-1 rounded-md hover:bg-white border border-transparent hover:border-neutral-200 transition-all cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="text-neutral-400 hover:text-rose-600 p-1 rounded-md hover:bg-white border border-transparent hover:border-neutral-200 transition-all cursor-pointer"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                    {catProducts.length === 0 && (
                      <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center col-span-3">
                        <Package className="w-8 h-8 text-neutral-300" />
                        <p className="text-neutral-500 text-xs mt-2">No hay platos registrados en esta categoría.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 3: SUCURSALES Y CAJAS */}
      {activeTab === "branches" && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="font-bold text-neutral-900 text-lg">Estado de Sucursales</h2>
            <p className="text-xs text-neutral-500">Inspecciona las ubicaciones activas y las cajas registradoras de cada una.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {branches.map((b) => {
              // Find if this branch has any shifts registered
              const branchShifts = shifts.filter((s) => s.sucursalId === b.id);
              const activeBranchShift = branchShifts.find((s) => s.status === "open");

              return (
                <div key={b.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-neutral-950 text-base">{b.name}</h3>
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {b.address}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      activeBranchShift ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                    }`}>
                      {activeBranchShift ? "POS Activo" : "Sin Turno"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-600">
                      <span>Cajero a cargo:</span>
                      <span className="font-semibold text-neutral-800">{activeBranchShift ? activeBranchShift.cashierName : "Ninguno (Caja cerrada)"}</span>
                    </div>

                    {activeBranchShift && (
                      <>
                        <div className="flex items-center justify-between text-xs text-neutral-600">
                          <span>Apertura de Turno:</span>
                          <span className="font-mono text-neutral-800">{new Date(activeBranchShift.openedAt).toLocaleTimeString("es-CL", {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-neutral-600">
                          <span>Monto Esperado en Caja:</span>
                          <span className="font-mono font-bold text-emerald-600">${activeBranchShift.expectedCash.toLocaleString("es-CL")}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-xl space-y-2 border border-neutral-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Historial de Turnos de Caja</span>
                    <div className="space-y-1 max-h-[120px] overflow-y-auto">
                      {branchShifts.length === 0 ? (
                        <p className="text-neutral-400 text-xs italic">No hay historial de turnos para esta sucursal.</p>
                      ) : (
                        branchShifts.map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] py-1 border-b border-neutral-100 last:border-0 text-neutral-600">
                            <span className="font-medium">{s.cashierName}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {new Date(s.openedAt).toLocaleDateString("es-CL")}
                              </span>
                              <span className={`font-mono px-1 rounded ${
                                s.status === "open" ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-700"
                              }`}>
                                {s.status === "open" ? "Abierto" : "Cerrado"}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: LISTA DE ESPERA B2B */}
      {activeTab === "waitlist" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Registro de Prospectos B2B</h2>
              <p className="text-neutral-500 text-xs">Supervisa y contacta a los dueños de restaurantes inscritos en la lista de espera de FoodHub.</p>
            </div>
          </div>

          {/* KPI Mini-cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Prospectos</span>
              <h4 className="text-3xl font-black text-neutral-900 mt-1 font-mono">{waitlist.length}</h4>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Pendientes de Contacto</span>
              <h4 className="text-3xl font-black text-amber-500 mt-1 font-mono">
                {waitlist.filter(w => w.status === "pending").length}
              </h4>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Contactados</span>
              <h4 className="text-3xl font-black text-emerald-500 mt-1 font-mono">
                {waitlist.filter(w => w.status === "contacted").length}
              </h4>
            </div>
          </div>

          {/* Prospects Table/List */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
              <h3 className="font-bold text-sm text-neutral-800">Inscripciones Recientes</h3>
            </div>
            
            {waitlist.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Rocket className="w-12 h-12 text-neutral-300 mx-auto animate-pulse" />
                <h4 className="text-base font-bold text-neutral-800">No hay registros aún</h4>
                <p className="text-neutral-400 text-xs max-w-sm mx-auto">Prueba simulando ser un prospecto en la pestaña de &quot;SaaS Landing&quot; y regístrate para ver cómo impacta aquí en tiempo real.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider font-mono text-[10px] bg-neutral-50">
                      <th className="py-3.5 px-5 font-semibold">Negocio</th>
                      <th className="py-3.5 px-5 font-semibold">Propietario / Contacto</th>
                      <th className="py-3.5 px-5 font-semibold">Tipo / Volumen</th>
                      <th className="py-3.5 px-5 font-semibold">Inscripción</th>
                      <th className="py-3.5 px-5 font-semibold">Estado</th>
                      <th className="py-3.5 px-5 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {waitlist.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                        
                        {/* Negocio */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="bg-neutral-100 text-neutral-700 p-2 rounded-lg">
                              <Building className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-neutral-900 text-sm">{item.businessName}</h4>
                              <span className="text-[11px] text-neutral-500 font-medium">{item.restaurantType}</span>
                            </div>
                          </div>
                        </td>

                        {/* Propietario / Contacto */}
                        <td className="py-4 px-5 space-y-1">
                          <p className="font-bold text-neutral-900">{item.ownerName}</p>
                          <div className="flex items-center gap-3 text-neutral-500">
                            <a href={`mailto:${item.email}`} className="hover:text-emerald-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{item.email}</span>
                            </a>
                            <span className="text-neutral-300">|</span>
                            <a href={`tel:${item.phone}`} className="hover:text-emerald-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{item.phone}</span>
                            </a>
                          </div>
                        </td>

                        {/* Tipo / Volumen */}
                        <td className="py-4 px-5">
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium text-[10px]">
                              <span>Volumen: {item.monthlyOrders} ped/mes</span>
                            </div>
                          </div>
                        </td>

                        {/* Inscripción */}
                        <td className="py-4 px-5 text-neutral-500">
                          <div className="space-y-0.5">
                            <p>{new Date(item.timestamp).toLocaleDateString("es-CL", {day: 'numeric', month: 'short'})}</p>
                            <p className="text-[10px] text-neutral-400 font-mono">{new Date(item.timestamp).toLocaleTimeString("es-CL", {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                            item.status === "contacted" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === "contacted" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                            {item.status === "contacted" ? "Contactado" : "Pendiente"}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.status === "pending" ? (
                              <button
                                onClick={() => updateWaitlistStatus(item.id, "contacted")}
                                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-1.5 rounded-lg border border-emerald-200/50 hover:border-emerald-300 transition-colors cursor-pointer"
                                title="Marcar como Contactado"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => updateWaitlistStatus(item.id, "pending")}
                                className="bg-neutral-100 text-neutral-600 hover:bg-neutral-200 p-1.5 rounded-lg border border-neutral-200 transition-colors cursor-pointer"
                                title="Devolver a Pendiente"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteWaitlistProspect(item.id)}
                              className="bg-rose-50 text-rose-600 hover:bg-rose-100 p-1.5 rounded-lg border border-rose-200/50 hover:border-rose-300 transition-colors cursor-pointer"
                              title="Eliminar Registro"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
