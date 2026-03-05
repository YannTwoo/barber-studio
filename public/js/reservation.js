const dateSelect = document.getElementById("date")
const heureSelect = document.getElementById("heure")
const form = document.getElementById("reservationForm")
const message = document.getElementById("message")

const horaires = ["10:30","11:00","11:30","12:00"]

// générer les 7 prochains jours
function generateDates(){

const today = new Date()

for(let i=0;i<7;i++){

const d = new Date()
d.setDate(today.getDate()+i)

const value = d.toISOString().split("T")[0]

const option = document.createElement("option")

option.value = value
option.textContent = d.toLocaleDateString("fr-FR")

dateSelect.appendChild(option)

}

}

generateDates()

// récupérer les réservations
async function loadReservations(){

const res = await fetch("/api/reservations")
const reservations = await res.json()

dateSelect.addEventListener("change",()=>{

const selectedDate = dateSelect.value

// reset horaires
heureSelect.innerHTML = '<option value="">Choisir un horaire</option>'

horaires.forEach(h=>{

const option = document.createElement("option")

option.value = h
option.textContent = h

const taken = reservations.find(r=> r.date === selectedDate && r.heure === h)

if(taken){
option.disabled = true
option.textContent = h + " (complet)"
}

heureSelect.appendChild(option)

})

})

}

loadReservations()

// envoyer réservation
form.addEventListener("submit",async e=>{

e.preventDefault()

const nom = document.getElementById("nom").value
const coupe = document.getElementById("coupe").value
const date = dateSelect.value
const heure = heureSelect.value
const service = document.getElementById("service").value

const res = await fetch("/api/reserver",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
nom,
coupe,
date,
heure,
service
})

})

const data = await res.json()

if(data.success){

message.textContent="Réservation confirmée"

form.reset()

}else{

message.textContent=data.error

}

})
