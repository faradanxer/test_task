const axios = require("axios");

async function loadJSON(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при загрузке JSON: ${error.message}`);
    throw error;
  }
}

async function getCommentsForPost(postId) {
  try {
    const comments = await loadJSON(
      `http://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
    return comments;
  } catch (error) {
    console.error(
      `Ошибка при загрузке комментариев для поста с ID ${postId}:`,
      error
    );
    return [];
  }
}

async function createUserObject(user, news) {
  const userNews = await Promise.all(
    news
      .filter((news) => news.userId === user.id)
      .map(async ({ id, title, body }) => {
        if (user.id === 2) {
          const comments = await getCommentsForPost(id);
          return {
            id,
            title,
            title_crop: title.length > 20 ? title.slice(0, 20) + "..." : title,
            body,
            comments,
          };
        } else {
          return {
            id,
            title,
            title_crop: title.length > 20 ? title.slice(0, 20) + "..." : title,
            body,
          };
        }
      })
  );
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: `${user.address.city}, ${user.address.street}, ${user.address.suite}`,
    website: `https://${user.website}`,
    company: user.company.name,
    posts: userNews,
  };
}

async function combineData() {
  try {
    const users = await loadJSON("http://jsonplaceholder.typicode.com/users");
    const news = await loadJSON("http://jsonplaceholder.typicode.com/posts");
    const combinedData = await Promise.all(
      users.map((user) => createUserObject(user, news))
    );
    console.log(combinedData);
  } catch (error) {
    console.error("Произошла ошибка:", error);
  }
}

combineData();
