

export class LocalStorageHandler{

    saveItem(key, item){
        localStorage.setItem(key, JSON.stringify(item));
    }

    getItem(key){
        // Retorna null si no existe, o parsea el objeto
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    removeItem(key){
        localStorage.removeItem(key);
    }

    updateItem(key, item){
     this.removeItem(key);
     this.saveItem(key, item);   
    }

}