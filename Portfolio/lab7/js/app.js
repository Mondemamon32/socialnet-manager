// ===============================
// SUPABASE CONNECTION
// ===============================
const { createClient } = supabase

const db = createClient(
  "https://tdycbqtdnjsuftapsmoy.supabase.co",
  "sb_publishable_oM8RKvL8orb7DczXMeYIiQ_R4zaAaUr"
)

let currentProfileId = null

const DEFAULT_AVATAR =
  "https://spxpuyyakhdpslis.public.blob.vercel-storage.com/avatars/default.webp"


// ===============================
// STATUS
// ===============================
function setStatus(msg, isError = false) {
  const bar = document.getElementById("status-message")
  const footer = document.getElementById("status-bar")

  bar.textContent = msg
  footer.style.background = isError ? "#6b1a1a" : "#2456b4"
}


// ===============================
// LOAD PROFILES
// ===============================
async function loadProfiles() {
  try {
    const { data, error } = await db
      .from("profiles")
      .select("*")
      .order("name")

    if (error) throw error

    const list = document.getElementById("profile-list")
    list.innerHTML = ""

    if (data.length === 0) {
      list.innerHTML = "<div>No profiles found</div>"
      return
    }

    data.forEach(p => {
      const div = document.createElement("div")
      div.className = "profile-item"

      const img = document.createElement("img")
      img.src = p.picture || DEFAULT_AVATAR
      img.width = 32
      img.height = 32
      img.style.borderRadius = "50%"
      img.style.objectFit = "cover"
      img.onerror = () => { img.src = DEFAULT_AVATAR }

      const name = document.createElement("span")
      name.textContent = p.name

      div.appendChild(img)
      div.appendChild(name)

      div.onclick = () => selectProfile(p.id)

      list.appendChild(div)
    })

  } catch (err) {
    console.error(err)
    setStatus("Error loading profiles", true)
  }
}


// ===============================
// SELECT PROFILE
// ===============================
async function selectProfile(id) {
  try {
    currentProfileId = id

    const { data: profile, error } = await db
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error

    document.getElementById("profile-name").textContent = profile.name
    document.getElementById("profile-status").textContent = profile.status || "--"
    document.getElementById("profile-quote").textContent = profile.quote || "--"
    document.getElementById("profile-pic").src = profile.picture || DEFAULT_AVATAR

    await loadFriends(id)

    setStatus("Viewing " + profile.name)

  } catch (err) {
    console.error(err)
    setStatus("Error loading profile", true)
  }
}


// ===============================
// LOOKUP (USES input-search)
// ===============================
async function lookUpProfile() {
  const name = document.getElementById("input-search").value.trim()

  if (!name) {
    setStatus("Enter a name to search", true)
    return
  }

  try {
    const { data, error } = await db
      .from("profiles")
      .select("*")
      .ilike("name", `%${name}%`)
      .limit(1)

    if (error || data.length === 0) {
      setStatus(`No profile found for "${name}"`, true)
      return
    }

    await selectProfile(data[0].id)

    setStatus(`Found: ${data[0].name}`)

  } catch (err) {
    console.error(err)
    setStatus("Search error", true)
  }
}


// ===============================
// ADD PROFILE (USES input-name)
// ===============================
async function addProfile() {
  const nameInput = document.getElementById("input-name")
  const name = nameInput.value.trim()

  if (!name) {
    setStatus("Name required", true)
    return
  }

  try {
    const { data, error } = await db
      .from("profiles")
      .insert({ name })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        setStatus(`"${name}" already exists`, true)
      } else {
        throw error
      }
      return
    }

    nameInput.value = ""

    await loadProfiles()
    await selectProfile(data.id)

    setStatus(`Profile "${name}" added`)

  } catch (err) {
    console.error(err)
    setStatus("Error adding profile", true)
  }
}


// ===============================
// DELETE PROFILE
// ===============================
async function deleteProfile() {
  if (!currentProfileId) {
    setStatus("Select a profile first", true)
    return
  }

  await db.from("profiles").delete().eq("id", currentProfileId)

  currentProfileId = null
  loadProfiles()

  setStatus("Profile deleted")
}


// ===============================
// CHANGE STATUS
// ===============================
async function changeStatus() {
  if (!currentProfileId) {
    setStatus("Select a profile first", true)
    return
  }

  const val = document.getElementById("input-status").value.trim()

  await db.from("profiles")
    .update({ status: val })
    .eq("id", currentProfileId)

  selectProfile(currentProfileId)
  setStatus("Status updated")
}


// ===============================
// CHANGE QUOTE
// ===============================
async function changeQuote() {
  if (!currentProfileId) {
    setStatus("Select a profile first", true)
    return
  }

  const val = document.getElementById("input-quote").value.trim()

  await db.from("profiles")
    .update({ quote: val })
    .eq("id", currentProfileId)

  selectProfile(currentProfileId)
  setStatus("Quote updated")
}


// ===============================
// CHANGE PICTURE (SAFE + CORRECT)
// ===============================
async function changePicture() {
  if (!currentProfileId) {
    setStatus("Select a profile first", true)
    return
  }

  const file = document.getElementById("input-file").files[0]
  const url = document.getElementById("input-picture").value.trim()

  // FILE UPLOAD
  if (file) {
    try {
      setStatus("Uploading...")

      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData
      })

      const rawText = await res.text()

      let data
      try {
        data = JSON.parse(rawText)
      } catch {
        console.error(rawText)
        setStatus("Server returned invalid response", true)
        return
      }

      if (!res.ok) {
        setStatus(data.error || "Upload failed", true)
        return
      }

      await db
        .from("profiles")
        .update({ picture: data.url })
        .eq("id", currentProfileId)

      document.getElementById("profile-pic").src = data.url

      setStatus("Uploaded successfully ✅")

    } catch (err) {
      console.error(err)
      setStatus("Upload error", true)
    }

    return
  }

  // URL INPUT
  if (url) {
    await db
      .from("profiles")
      .update({ picture: url })
      .eq("id", currentProfileId)

    document.getElementById("profile-pic").src = url

    setStatus("Updated image URL")
    return
  }

  setStatus("Upload a file or paste a URL", true)
}


// ===============================
// LOAD FRIENDS (FIXED)
// ===============================
async function loadFriends(id) {
  const { data } = await db
    .from("friends")
    .select("profile_id, friend_id")
    .or(`profile_id.eq.${id},friend_id.eq.${id}`)

  const list = document.getElementById("friends-list")
  list.innerHTML = ""

  if (!data || data.length === 0) {
    list.innerHTML = "<div>No friends yet</div>"
    return
  }

  const friendIds = data.map(row =>
    row.profile_id === id ? row.friend_id : row.profile_id
  )

  const { data: profiles } = await db
    .from("profiles")
    .select("id,name")
    .in("id", friendIds)

  profiles.forEach(p => {
    const div = document.createElement("div")
    div.textContent = p.name
    list.appendChild(div)
  })
}


// ===============================
// ADD FRIEND
// ===============================
async function addFriend() {
  const name = document.getElementById("input-friend").value.trim()

  const { data } = await db
    .from("profiles")
    .select("id")
    .eq("name", name)
    .single()

  await db.from("friends").insert({
    profile_id: currentProfileId,
    friend_id: data.id
  })

  loadFriends(currentProfileId)
  setStatus("Friend added")
}


// ===============================
// REMOVE FRIEND
// ===============================
async function removeFriend() {
  const name = document.getElementById("input-remove-friend").value.trim()

  const { data } = await db
    .from("profiles")
    .select("id")
    .eq("name", name)
    .single()

  await db.from("friends")
    .delete()
    .eq("profile_id", currentProfileId)
    .eq("friend_id", data.id)

  loadFriends(currentProfileId)
  setStatus("Friend removed")
}


// ===============================
// EVENTS
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("btn-add").onclick = addProfile
  document.getElementById("btn-lookup").onclick = lookUpProfile
  document.getElementById("btn-delete").onclick = deleteProfile

  document.getElementById("btn-status").onclick = changeStatus
  document.getElementById("btn-quote").onclick = changeQuote
  document.getElementById("btn-picture").onclick = changePicture

  document.getElementById("btn-add-friend").onclick = addFriend
  document.getElementById("btn-remove-friend").onclick = removeFriend

  loadProfiles()
})