//export const isEmpty = value =>value.trim().length === 0 ;

export function isEmpty(value){
    const test = value.trim().length === 0;
    return test;
}
export function showAlert(message, className){
    //Create a div
    const div = document.createElement("div");
    //Add classes
    div.className = `alert alert-${className}`;
    //Add text
    div.appendChild(document.createTextNode(message));
    //Get jumbotron
    const jumbotron = document.querySelector("#jumbotron");
    //Get form div 
    const form = document.querySelector("#form-div");
    //Insert Alert
    jumbotron.insertBefore(div,form);
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
}