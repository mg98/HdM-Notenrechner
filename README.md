# HdM Notenrechner

Dies ist eine Plattform für Studierende der Hochschule der Medien Stuttgart, mit dem Ziel eine schnellere und übersichtlichere Ansicht über den aktuellen Notenspiegel zu geben, als es die hochschuleigenen Dienste bieten. Zusätzlich im Fokus stehen das Einsetzen von Wunschnoten, Hinzufügen/ Planen zukünftig abzulegender Module und die parallele Sofortberechnung des Notenschnitts.

Die App ist live erreichbar auf https://notenrechner.io/ und kann mit gültigen HdM-Nutzerdaten bereits verwendet werden.

## Lokales Setup

```
git clone https://github.com/mg98/HdM-Notenrechner.git
cd HdM-Notenrechner/client
npm install
cd ../server
npm install
npm run import
cd ..
```

#### Mit Docker

```
docker-compose up
```

#### Ohne Docker

```
# Client starten
cd client
npm start
```
```
# Server starten
cd ../server/
npm start
```
Die App ist nun unter http://localhost:8080 erreichbar.


Pull Requests sind sehr willkommen!
