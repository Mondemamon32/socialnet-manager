// ===============================
// SUPABASE CONNECTION
// ===============================
const { createClient } = supabase

const SUPABASE_URL = "https://tdycbqtdnjsuftapsmoy.supabase.co"
const SUPABASE_KEY = "sb_publishable_oM8RKvL8orb7DczXMeYIiQ_R4zaAaUr"

const db = createClient(SUPABASE_URL, SUPABASE_KEY)

let currentProfileId = null



// ===============================
// STATUS BAR
// ===============================
function setStatus(message){
document.getElementById("status-message").textContent = message
}



// ===============================
// CLEAR CENTER PANEL
// ===============================
function clearCenter(){

document.getElementById("profile-pic").src =
"resources/images/default.png"

document.getElementById("profile-name").textContent =
"No Profile Selected"

document.getElementById("profile-status").textContent = "--"

document.getElementById("profile-quote").textContent = "--"

document.getElementById("friends-list").innerHTML = ""

currentProfileId = null

}



// ===============================
// DISPLAY PROFILE
// ===============================
function displayProfile(profile){

document.getElementById("profile-name").textContent =
profile.name

document.getElementById("profile-status").textContent =
profile.status || "--"

document.getElementById("profile-quote").textContent =
profile.quote || "--"

document.getElementById("profile-pic").src =
profile.picture || "resources/images/default.png"

currentProfileId = profile.id

}



// ===============================
// LOAD PROFILE LIST
// ===============================
async function loadProfiles(){

const {data,error} = await db
.from("profiles")
.select("id,name,picture")
.order("name")

if(error){
setStatus("Error loading profiles")
return
}

const list = document.getElementById("profile-list")
list.innerHTML = ""

data.forEach(profile=>{

const row = document.createElement("div")

row.className = "profile-item d-flex align-items-center gap-2"
row.dataset.id = profile.id

// profile image
const img = document.createElement("img")
img.src = profile.picture || "resources/images/default.png"
img.width = 32
img.height = 32
img.style.borderRadius = "50%"
img.style.objectFit = "cover"

// profile name
const name = document.createElement("span")
name.textContent = profile.name

row.appendChild(img)
row.appendChild(name)

row.onclick = () => selectProfile(profile.id)

list.appendChild(row)

})

}

// ===============================
// SELECT PROFILE
// ===============================
async function selectProfile(id){

const {data,error} = await db
.from("profiles")
.select("*")
.eq("id",id)
.single()

if(error){
setStatus("Error loading profile")
return
}

displayProfile(data)

loadFriends(id)

setStatus("Viewing profile: " + data.name)

}



// ===============================
// LOOK UP PROFILE
// ===============================
async function lookUpProfile(){

const name = document.getElementById("input-search").value.trim()

if(!name){
setStatus("Enter a name to search")
return
}

const {data,error} = await db
.from("profiles")
.select("id,name")
.ilike("name", `%${name}%`)
.limit(1)

if(error){
setStatus("Search error")
return
}

if(data.length === 0){
setStatus("Profile not found")
clearCenter()
return
}

selectProfile(data[0].id)

}



// ===============================
// ADD PROFILE
// ===============================
async function addProfile(){

const name = document.getElementById("input-name").value.trim()

if(!name){
setStatus("Name required")
return
}

const {data,error} = await db
.from("profiles")
.insert({name})
.select()
.single()

if(error){
setStatus("Error adding profile")
return
}

document.getElementById("input-name").value=""

await loadProfiles()

selectProfile(data.id)

setStatus("Profile added: " + name)

}



// ===============================
// DELETE PROFILE
// ===============================
async function deleteProfile(){

if(!currentProfileId){
setStatus("Select a profile first")
return
}

await db
.from("profiles")
.delete()
.eq("id",currentProfileId)

clearCenter()

loadProfiles()

setStatus("Profile deleted")

}



// ===============================
// CHANGE STATUS
// ===============================
async function changeStatus(){

if(!currentProfileId){
setStatus("Select a profile first")
return
}

const status = document.getElementById("input-status").value

await db
.from("profiles")
.update({status})
.eq("id",currentProfileId)

document.getElementById("profile-status").textContent = status

setStatus("Status updated")

}



// ===============================
// CHANGE PICTURE
// ===============================
async function changePicture(){

if(!currentProfileId){
setStatus("Select a profile first")
return
}

const pic = document.getElementById("input-picture").value

await db
.from("profiles")
.update({picture:pic})
.eq("id",currentProfileId)

document.getElementById("profile-pic").src = pic

setStatus("Picture updated")

}



// ===============================
// LOAD FRIENDS
// ===============================
async function loadFriends(profileId){

const {data,error} = await db
.from("friends")
.select(`
friend_id,
profiles:friend_id (name, picture)
`)
.eq("profile_id",profileId)

if(error){
setStatus("Error loading friends")
return
}

const list = document.getElementById("friends-list")
list.innerHTML=""

if(data.length === 0){
list.innerHTML = "<div>No friends yet</div>"
return
}

data.forEach(friend=>{

const row = document.createElement("div")
row.className = "friend-entry d-flex align-items-center gap-2"

const img = document.createElement("img")
img.src = friend.profiles.picture || "resources/images/default.png"
img.width = 32
img.height = 32
img.style.borderRadius = "50%"

const name = document.createElement("span")
name.textContent = friend.profiles.name

row.appendChild(img)
row.appendChild(name)

list.appendChild(row)

})

}


// ===============================
// ADD FRIEND
// ===============================
async function addFriend(){

if(!currentProfileId){
setStatus("Select a profile first")
return
}

const name = document.getElementById("input-friend").value.trim()

const {data} = await db
.from("profiles")
.select("id,name,picture")
.ilike("name",name)
.limit(1)

if(data.length === 0){
setStatus("Friend not found")
return
}

await db
.from("friends")
.insert({
profile_id:currentProfileId,
friend_id:data[0].id
})

loadFriends(currentProfileId)

setStatus("Friend added")

}



// ===============================
// REMOVE FRIEND
// ===============================
async function removeFriend(){

if(!currentProfileId){
setStatus("Select a profile first")
return
}

const name = document.getElementById("input-remove-friend").value.trim()

const {data} = await db
.from("profiles")
.select("id")
.ilike("name",name)
.limit(1)

if(data.length===0){
setStatus("Friend not found")
return
}

await db
.from("friends")
.delete()
.eq("profile_id",currentProfileId)
.eq("friend_id",data[0].id)

loadFriends(currentProfileId)

setStatus("Friend removed")

}



// ===============================
// EVENT LISTENERS
// ===============================
document.addEventListener("DOMContentLoaded",()=>{

document.getElementById("btn-add").onclick = addProfile

document.getElementById("btn-lookup").onclick = lookUpProfile

document.getElementById("btn-delete").onclick = deleteProfile

document.getElementById("btn-status").onclick = changeStatus

document.getElementById("btn-picture").onclick = changePicture

document.getElementById("btn-add-friend").onclick = addFriend

document.getElementById("btn-remove-friend").onclick = removeFriend

loadProfiles()

})