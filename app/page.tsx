"use client";

import React, { useState, useEffect } from "react";

interface Pedido {
  id: string;
  cliente: string;
  producto: string;
  fechaReserva: string;
  fechaEntrega: string;
  inversion: number;
  costo: number;
}

export default function Home() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [seccionActual, setSeccionActual] = useState("menu");
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  const hoy = new Date().toISOString().split("T")[0];

  const [nuevoPedido, setNuevoPedido] = useState({
    cliente: "", producto: "", fechaReserva: hoy, fechaEntrega: "", inversion: "", costo: ""
  });

  useEffect(() => {
    const data = localStorage.getItem("pedidos_v8_final");
    if (data) setPedidos(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("pedidos_v8_final", JSON.stringify(pedidos));
  }, [pedidos]);

  const agregarPedido = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoPedido.cliente || !nuevoPedido.fechaEntrega) return alert("Por favor, llena el nombre del cliente y la fecha de entrega");
    const pedido: Pedido = {
      id: crypto.randomUUID(),
      ...nuevoPedido,
      inversion: Number(nuevoPedido.inversion) || 0,
      costo: Number(nuevoPedido.costo) || 0,
    };
    setPedidos([pedido, ...pedidos]);
    setNuevoPedido({ cliente: "", producto: "", fechaReserva: hoy, fechaEntrega: "", inversion: "", costo: "" });
    alert("¡Pedido guardado con éxito! ✨");
  };

  const obtenerDatosSemanales = () => {
    const semanas = [];
    const fechaReferencia = new Date();
    for (let i = 0; i <= 10; i++) {
      let inv = 0, cos = 0;
      const inicio = new Date(fechaReferencia);
      inicio.setDate(inicio.getDate() - (inicio.getDay() === 0 ? 6 : inicio.getDay() - 1) - (i * 7));
      inicio.setHours(0,0,0,0);
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + 6);
      fin.setHours(23,59,59,999);

      pedidos.forEach(p => {
        const fP = new Date(p.fechaReserva + "T00:00:00");
        if (fP >= inicio && fP <= fin) {
          inv += p.inversion; cos += p.costo;
        }
      });
      semanas.push({ etiqueta: i === 0 ? "Semana Actual" : `Semana -${i}`, inv, cos, gan: cos - inv });
    }
    return semanas;
  };

  const datosSemanales = obtenerDatosSemanales();
  const pedidosOrdenados = [...pedidos].sort((a, b) => new Date(a.fechaEntrega).getTime() - new Date(b.fechaEntrega).getTime());

  return (
    <main className="min-h-screen bg-[#fff5f7] text-gray-800 font-sans pb-10">
      
      {/* BOTÓN MENÚ FLOTANTE (MÁS GRANDE PARA CELULAR) */}
      <button 
        onClick={() => setMenuAbierto(true)}
        className="fixed top-5 left-5 z-50 bg-pink-500 text-white w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-3xl active:scale-90 transition-transform"
      >
        ☰
      </button>

      {/* MENÚ LATERAL */}
      {menuAbierto && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="bg-white w-3/4 h-full shadow-2xl p-8 flex flex-col gap-4 animate-in slide-in-from-left">
            <div className="flex justify-between items-center mb-6">
              <p className="font-black text-pink-600 italic">NAVEGACIÓN</p>
              <button onClick={() => setMenuAbierto(false)} className="text-3xl text-gray-300">✕</button>
            </div>
            <button onClick={() => { setSeccionActual("menu"); setMenuAbierto(false); }} className={`p-5 rounded-2xl font-black text-left ${seccionActual === 'menu' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700'}`}>🏠 REGISTRAR</button>
            <button onClick={() => { setSeccionActual("lista"); setMenuAbierto(false); }} className={`p-5 rounded-2xl font-black text-left ${seccionActual === 'lista' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700'}`}>📋 PEDIDOS</button>
            <button onClick={() => { setSeccionActual("finanzas"); setMenuAbierto(false); }} className={`p-5 rounded-2xl font-black text-left ${seccionActual === 'finanzas' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700'}`}>💰 FINANZAS</button>
          </div>
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setMenuAbierto(false)}></div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="pt-24 px-4 max-w-4xl mx-auto">
        
        {/* LOGO Y NOMBRE */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-28 h-28 mb-3 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-pink-200 shadow-xl">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
          </div>
          <h1 className="text-3xl font-black text-pink-700 tracking-tighter text-center leading-none">
            Ingrid <span className="text-pink-400 block text-2xl">Delicias Únicas</span>
          </h1>
        </div>

        {/* VISTAS */}
        {seccionActual === "menu" && (
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-pink-50">
            <h2 className="text-xl font-black text-pink-600 mb-6 text-center uppercase tracking-widest">Nuevo Pedido</h2>
            <form onSubmit={agregarPedido} className="space-y-4">
              <input placeholder="Cliente" className="w-full p-4 bg-pink-50/50 rounded-2xl outline-none font-bold" value={nuevoPedido.cliente} onChange={(e) => setNuevoPedido({...nuevoPedido, cliente: e.target.value})} />
              <input placeholder="Producto (Pastel, Pay...)" className="w-full p-4 bg-pink-50/50 rounded-2xl outline-none font-bold" value={nuevoPedido.producto} onChange={(e) => setNuevoPedido({...nuevoPedido, producto: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col"><label className="text-[10px] font-bold ml-2 text-pink-300 uppercase">Reserva</label>
                <input type="date" className="p-4 bg-gray-100 rounded-2xl font-bold text-gray-400" value={nuevoPedido.fechaReserva} readOnly /></div>
                <div className="flex flex-col"><label className="text-[10px] font-bold ml-2 text-pink-500 uppercase">Entrega</label>
                <input type="date" className="p-4 bg-pink-50 rounded-2xl outline-none font-bold ring-2 ring-pink-200" value={nuevoPedido.fechaEntrega} onChange={(e) => setNuevoPedido({...nuevoPedido, fechaEntrega: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Inversión $" className="p-4 bg-pink-50/50 rounded-2xl font-bold text-red-500" value={nuevoPedido.inversion} onChange={(e) => setNuevoPedido({...nuevoPedido, inversion: e.target.value})} />
                <input type="number" placeholder="Venta $" className="p-4 bg-pink-50/50 rounded-2xl font-bold text-green-600" value={nuevoPedido.costo} onChange={(e) => setNuevoPedido({...nuevoPedido, costo: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-pink-500 text-white p-5 rounded-2xl font-black text-xl mt-4 shadow-lg active:scale-95 transition-transform">GUARDAR ✨</button>
            </form>
          </div>
        )}

        {seccionActual === "lista" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-pink-600 text-center uppercase tracking-tighter mb-6 italic">Próximas Entregas</h2>
            {pedidosOrdenados.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-3xl shadow-md border-l-8 border-pink-400 flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-black text-pink-900 leading-none mb-1">{p.cliente}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">{p.producto || "Sin especificar"}</p>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-lg text-gray-500 font-bold">R: {p.fechaReserva}</span>
                    <span className="text-[10px] bg-pink-100 px-2 py-1 rounded-lg text-pink-600 font-black italic">E: {p.fechaEntrega}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-green-600 mb-2">${p.costo}</p>
                  <button onClick={() => setPedidos(pedidos.filter(i => i.id !== p.id))} className="text-[10px] text-red-300 font-bold uppercase tracking-widest">Borrar</button>
                </div>
              </div>
            ))}
            {pedidos.length === 0 && <p className="text-center py-20 text-gray-300 italic">No tienes pedidos pendientes</p>}
          </div>
        )}

        {seccionActual === "finanzas" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-pink-600 text-center uppercase italic mb-6">Mis Ganancias</h2>
            <div className="space-y-3">
              {datosSemanales.map((sem, idx) => (
                <div key={idx} className={`p-5 rounded-3xl shadow-sm flex justify-between items-center border ${idx === 0 ? 'bg-pink-500 text-white border-pink-600 scale-105 mb-4' : 'bg-white border-pink-50 text-gray-800'}`}>
                  <div>
                    <p className={`font-black uppercase text-xs ${idx === 0 ? 'text-pink-100' : 'text-pink-300'}`}>{sem.etiqueta}</p>
                    <p className={`text-2xl font-black`}>${sem.gan}</p>
                  </div>
                  <div className="text-right text-[10px] font-bold space-y-1">
                    <p className={idx === 0 ? 'text-pink-100' : 'text-red-400'}>Inversión: ${sem.inv}</p>
                    <p className={idx === 0 ? 'text-pink-100' : 'text-green-600'}>Ventas: ${sem.cos}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}