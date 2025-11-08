
export class LocalStorageHandler{

    saveItem(key, item){
        localStorage.setItem(key, JSON.stringify(item));
    }

    getItem(key){
        return JSON.parse(localStorage.getItem(key));
    }

    removeItem(key){
        localStorage.removeItem(key);
    }

    updateItem(key, item){
     this.removeItem(key);
     this.saveItem(key, item);   
    }

}