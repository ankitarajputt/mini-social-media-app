// =======================
// REGISTER USER
// =======================

async function registerUser() {

    try {

       const name = document.getElementById("name").value;

        const email = document.getElementById("email").value;

        const password = document.getElementById("password").value;

        const response = await fetch("http://localhost:5000/api/users/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        alert(data.message);

    } catch (error) {

        console.log(error);
    }
}



// =======================
// LOGIN USER
// =======================

async function loginUser() {

    try {

        const email = document.getElementById("loginEmail").value;

        const password = document.getElementById("loginPassword").value;

        const response = await fetch("http://localhost:5000/api/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        localStorage.setItem("user", JSON.stringify(data));

        alert("Login successful");

    } catch (error) {

        console.log(error);
    }
}



// =======================
// CREATE POST
// =======================

async function createPost() {

    try {

        const user = JSON.parse(localStorage.getItem("user"));

        const description = document.getElementById("postText").value;

        const imageFile = document.getElementById("imageInput").files[0];

        let imageName = "";



        // =======================
        // UPLOAD IMAGE
        // =======================

        if (imageFile) {

            const formData = new FormData();

            formData.append("image", imageFile);

            const uploadResponse = await fetch("http://localhost:5000/api/upload", {

                method: "POST",

                body: formData
            });

            const uploadData = await uploadResponse.json();

            imageName = uploadData.imageUrl;
        }



        // =======================
        // CREATE POST
        // =======================

        const response = await fetch("http://localhost:5000/api/posts/create", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                userId: user.id,

                description: description,

                image: imageName
            })
        });

        const data = await response.json();

        alert(data.message);

        getPosts();

        getMyPosts();

    } catch (error) {

        console.log(error);
    }
}



// =======================
// GET ALL POSTS
// =======================

async function getPosts() {

    try {

        const response = await fetch("http://localhost:5000/api/posts/all");

        const posts = await response.json();

        const feed = document.getElementById("posts");

        feed.innerHTML = "";

        posts.forEach(post => {

            feed.innerHTML += `

                <div class="post">

                    <h3>${post.description}</h3>

                    ${post.image ? `
                        <img src="http://localhost:5000/uploads/${post.image}" width="300">
                    ` : ""}

                    <p>Likes: ${post.likes.length}</p>

                    <button onclick="likePost('${post._id}')">
                        Like
                    </button>

                    <button onclick="deletePost('${post._id}')">
                        Delete
                    </button>

                    <button onclick="editPost('${post._id}')">
                        Edit
                    </button>

                    <br><br>

                    <input 
                        type="text"
                        id="comment-${post._id}"
                        placeholder="Write comment"
                    >

                    <button onclick="addComment('${post._id}')">
                        Comment
                    </button>

                    <div>

                        ${
                            post.comments.map(comment => `
                                <p>💬 ${comment.text}</p>
                            `).join("")
                        }

                    </div>

                </div>
            `;
        });

    } catch (error) {

        console.log(error);
    }
}



// =======================
// LIKE / UNLIKE POST
// =======================

async function likePost(postId) {

    try {

        const user = JSON.parse(localStorage.getItem("user"));

        await fetch(`http://localhost:5000/api/posts/${postId}/like`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                userId: user.id
            })
        });

        getPosts();

        getMyPosts();

    } catch (error) {

        console.log(error);
    }
}



// =======================
// ADD COMMENT
// =======================

async function addComment(postId) {

    try {

        const user = JSON.parse(localStorage.getItem("user"));

        const text = document.getElementById(`comment-${postId}`).value;

        await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                userId: user.id,
                text: text
            })
        });

        getPosts();

        getMyPosts();

    } catch (error) {

        console.log(error);
    }
}



// =======================
// DELETE POST
// =======================

async function deletePost(postId) {

    try {

        const user = JSON.parse(localStorage.getItem("user"));

        await fetch(`http://localhost:5000/api/posts/${postId}`, {

            method: "DELETE",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                userId: user.id
            })
        });

        getPosts();

        getMyPosts();

    } catch (error) {

        console.log(error);
    }
}



// =======================
// EDIT POST
// =======================

async function editPost(postId) {

    try {

        const user = JSON.parse(localStorage.getItem("user"));

        const newDescription = prompt("Enter new post text");

        if (!newDescription) return;

        await fetch(`http://localhost:5000/api/posts/${postId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                userId: user.id,

                description: newDescription
            })
        });

        getPosts();

        getMyPosts();

    } catch (error) {

        console.log(error);
    }
}



// =======================
// GET MY POSTS
// =======================

async function getMyPosts() {

    try {

        const user = JSON.parse(localStorage.getItem("user"));

        const response = await fetch("http://localhost:5000/api/posts/all");

        const posts = await response.json();

        const myPostsContainer = document.getElementById("myPosts");

        myPostsContainer.innerHTML = "";

        const myPosts = posts.filter(post => post.userId === user.id);

        myPosts.forEach(post => {

            myPostsContainer.innerHTML += `

                <div class="post">

                    <h3>${post.description}</h3>

                    ${post.image ? `
                        <img src="http://localhost:5000/uploads/${post.image}" width="300">
                    ` : ""}

                    <p>❤️ ${post.likes.length} Likes</p>

                </div>
            `;
        });

    } catch (error) {

        console.log(error);
    }
}



// =======================
// LOAD POSTS
// =======================

getPosts();

getMyPosts();