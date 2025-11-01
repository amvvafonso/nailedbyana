export function setItem (key, value) {
    try {
        window.localStorage.setItem(key, value);
    } 
    catch (error) {
        console. log (error);
    }
}


export function getItem (key) {
    try {
        const item = window.localStorage.getItem(key);
        return item;
    } 
    catch (error) {
        console. log(error);
    }
}
