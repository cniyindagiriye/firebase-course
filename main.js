
const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#cafe-form");

function renderCafe(doc){
    button = document.querySelector("button");
    let li = document.createElement("li");
    let name = document.createElement("span");
    let location = document.createElement("span");
    let cross = document.createElement("div");

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    location.textContent = doc.data().location;
    cross.textContent = "x";

    li.appendChild(name);
    li.appendChild(location);
    li.appendChild(cross);
    cafeList.appendChild(li);

    cross.addEventListener('click', e=>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    })

    li.addEventListener('click', e=>{
        e.stopPropagation();
        const span = document.querySelector("span");
        let update_id = span.parentElement.getAttribute("data-id");

        form.name.value = name.textContent;
        form.location.value = location.textContent;
        if(update_id != null){
            button.textContent = "Edit Cafe";
            form.addEventListener('submit' , e=>{
                db.collection('cafes')
                  .doc(update_id)
                  .set({
                      name: form.name.value,
                      location: form.location.value 
                  })
            })    

        }
        
    })
}
// db.collection("cafes").where('location', '==', 'Nyamagabe').orderBy('name').get().then(snapshot => {
//     snapshot.forEach(doc => {
//         renderCafe(doc)
//     });
// }) 

form.addEventListener('submit', e=>{
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        location: form.location.value
    })
    form.name.value = '';
    form.location.value = '';
    button.textContent = "Add Cafe";
});

db.collection('cafes').orderBy('location').onSnapshot(snapshot=>{
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderCafe(change.doc)
        }else if(change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    })
})