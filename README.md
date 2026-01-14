# Pathfinding Visualizer

Visualizzatore interattivo di algoritmi di pathfinding costruito con Next.js 16 e React 19. Permette di disegnare griglie, generare ostacoli con Perlin Noise, lanciare diverse strategie di ricerca e confrontarne le prestazioni con un benchmark integrato.

## Stack
- Next.js 16 (App Router) + React 19
- Tailwind 4 per lo stile
- TypeScript per tipizzazione e algoritmi

## Funzionalità principali
- **Algoritmi**: A* (A-Star), Dijkstra, Greedy Best-First Search (GBFS) e Breadth-First Search (BFS).
- **Interazione sulla griglia**: imposta start/target con un click, disegna/rimuovi muri e resetta la griglia in ogni momento.
- **Perlin Noise**: generazione procedurale di muri con parametri di scala e soglia personalizzabili.
- **Velocità di animazione**: selezione rapida di diverse velocità di rendering.
- **Metriche live**: nodi visitati, lunghezza del percorso, tempo medio di esecuzione e stato finale.
- **Benchmark**: esegue un numero configurabile di scenari casuali (con o senza Perlin) e restituisce le medie per ogni algoritmo.

## Come iniziare
Prerequisiti: Node.js 18+.

1) Installa le dipendenze
```bash
npm install
```

2) Avvia l’ambiente di sviluppo
```bash
npm run dev
```
Apri http://localhost:3000 per usare il visualizzatore.

## Script disponibili
- `npm run dev` — sviluppo con HMR.
- `npm run build` — build di produzione Next.js.
- `npm start` — avvia la build già compilata.
- `npm run lint` — esegue ESLint sul progetto.

## Utilizzo rapido
- **Seleziona algoritmo e velocità** dalla sezione Config.
- **Clicca sulla griglia** per impostare start, target e muri. Usa “Clear Grid” per resettare.
- **Generate Perlin Noise** per popolare automaticamente la mappa con ostacoli.
- **Visualize Algorithm** per animare l’esecuzione; **Stop Running** per fermare l’animazione.
- Consulta le **metriche** nella sezione Results.
- Nella sezione **Algorithm Benchmark**, scegli quante iterazioni eseguire (e se includere Perlin) e lancia il confronto fra gli algoritmi.

## Struttura del progetto
- `app/` — pagine, sezioni e componenti UI (App Router).
- `app/core/algorithms/` — implementazioni di pathfinding, tipi e utilità.
- `app/core/hooks/` — logica di controllo della griglia e riproduzione dell’animazione.
- `app/Section/` — blocchi principali dell’interfaccia (config, griglia, risultati, benchmark).
- `public/` — asset statici.
