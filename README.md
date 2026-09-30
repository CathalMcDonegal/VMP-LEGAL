# VMP LEGAL

App informativa sobre la normativa dels **Vehicles de Mobilitat Personal (patinets elèctrics)** a Espanya, basada en el **Real Decreto 518/2026** que entra en vigor l’**1 d’octubre de 2026**.

PWA instal·lable (estil *Terra X Correr*).

---

## Contingut de l’app

| Pestanya | Descripció |
|----------|------------|
| **Consulta** | Cercador de denúncies. Selecciona les infraccions i et mostra article + import. |
| **Nomenclàtor** | Normativa completa amb cercador de text. |
| **Guia** | Resum de les novetats, prohibicions i consells. |

Inclou **totes les infraccions habituals** relacionades amb VMP (casc, edat, vorera, passatger, llums, armilla, auriculars, mòbil, velocitat, registre, assegurança, alcohol, autopista, semàfor, pas de vianants, sentit contrari, carril bus, senyalització, vehicle no homologat/modificat, estacionament, prioritat, conducció temerària, etc.).

Marca d’aigua permanent a totes les pantalles: **TIP 18675 CME · TIP 1235 PL**

---

## Com publicar-la a GitHub Pages (recomanat)

1. Crea un repositori nou a GitHub (ex.: `vmp-legal`).
2. Puja **tot el contingut d’aquesta carpeta** a l’arrel del repositori:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `logo.jpg`
   - `README.md`
3. A GitHub → **Settings** → **Pages**:
   - Source: **Deploy from a branch**
   - Branch: `main` (o `master`) / carpeta `/ (root)`
4. Desa. Al cap d’un minut tindràs l’URL:
   ```
   https://EL-TEU-USUARI.github.io/vmp-legal/
   ```

### Instal·lar al mòbil

1. Obre l’URL amb **Chrome** (Android) o **Safari** (iOS).
2. Menú → **Afegeix a la pantalla d’inici** / **Instal·la l’aplicació**.
3. Ja la tindràs amb el logo i el nom **VMP LEGAL**.

---

## Estructura de fitxers

```
vmp-legal/
├── index.html      ← App principal (PWA)
├── manifest.json   ← Manifest per instal·lar
├── sw.js           ← Service Worker (funciona offline)
├── logo.jpg        ← Logo Policia Local La Palma de Cervelló
└── README.md
```

---

## Fonts normatives

- Real Decreto 518/2026, de 24 de juny (BOE-A-2026-13889)
- Reglament General de Circulació (RD 1428/2003, modificat)
- RD 52/2026 (Registre de Vehicles Personals Lleugers)
- Text refós de la Llei sobre Trànsit (RDLeg 6/2015)
- Ordenances municipals (poden afegir restriccions locals)

---

**VMP LEGAL** · Logo: Policia Local de La Palma de Cervelló  
TIP 18675 CME · TIP 1235 PL

Aplicació informativa. Les sancions poden variar segons l’ordenança municipal o el criteri de l’agent.
