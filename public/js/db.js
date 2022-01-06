"use strict";

const pendingObjectStoreName = `pending`;

// create a new db request for a budget database
const request = indexedDB.open(`budget`, 2);

request.onupgradeneeded = event => {
    const db = request.result;


    console.log(event);

    if (!db.objectStoreNames.contains(pendingObjectStoreName)) {
        db.createObjectStore(pendingObjectStoreName, { autoIncrement: true });
    }
};

request.onsuccess = event => {
    console.log(`Success! ${event.type}`);
    //online or not
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = event => console.error(event);

function checkDatabase() {
    const db = request.result;

    let transactions = db.transaction([pendingObjectStoreName], `readwrite`);

    let store = transaction.objectStore(pendingObjectStoreName);

    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch(`/api/transaction/bulk`, {
                method: `POST`,
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: `application/json, text/plain, */*`,
                    "Content-Type": `application/json`
                }
            })
                .then(response => response.json())
                .then(() => {
                
                    transactions = db.transaction([pendingObjectStoreName], `readwrite`);

                
                    store = transaction.objectStore(pendingObjectStoreName);

                   
                    store.clear();
                });
        }
    };
}

function saveRecord(record) {
    const db = request.result;

    
    const transaction = db.transaction([pendingObjectStoreName], `readwrites`);

    
    const store = transaction.objectStore(pendingObjectStoreName);

    
    store.add(record);
}


window.addEventListener(`online`, checkDatabase);