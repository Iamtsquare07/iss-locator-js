        //  Where the iss api endpoint
        const apiUrl = "https://api.wheretheiss.at/v1/satellites/25544";

        //  displaying the map on the page
        const leafletMap = L.map('issMap').setView([0, 0], 5);
        const attribution =
            '&copy; <a href="https://www.openstreetmap.org/copyright">Open Street Map</a>';

        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tiles = L.tileLayer(tileUrl, {
            attribution
        });
        tiles.addTo(leafletMap);

        // Making a marker with a custom icon
        const issIcon = L.icon({
            iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/ISS_spacecraft_model_1.png',
            iconSize: [50, 32],
            iconAnchor: [25, 16]
        });
        const marker = L.marker([0, 0], {
            icon: issIcon
        }).addTo(leafletMap);

      

        let initialLoad = false;
        async function issApp() {
            const response = await fetch(apiUrl)
            const issData = await response.json();
            const {
                latitude,
                longitude,
                timestamp,
                velocity,
                footprint
            } = issData;

            marker.setLatLng([latitude, longitude])

            if (initialLoad === false) {
                leafletMap.setView([latitude, longitude], 3);
                initialLoad = true;
            }
            const utime = timestamp,
             date = new Date(utime * 1000),
             hours = date.getHours(),
             minutes = "0" + date.getMinutes(),
             seconds = date.getSeconds(),
             timeNow = `${hours}: ${minutes.substr(-2)}: ${seconds}`
            
            document.getElementById("lat").textContent = latitude.toFixed(2) +"°";
            document.getElementById("lon").textContent = longitude.toFixed(2) +"°";
            document.getElementById("time").textContent = timeNow;
            document.getElementById("velocity").textContent = velocity.toFixed(2);
            document.getElementById("footprint").textContent = footprint.toFixed(2);;
            return {
                issData
            }
        }


        const myInterval = setInterval(issApp, 3000)

        document.querySelector(".recenter").addEventListener("click", async function() {
            const iss = await issApp();
            const {
                latitude,
                longitude
            } = iss.issData;
            leafletMap.setView([latitude, longitude], 4);
        })