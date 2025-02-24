export const RouteIndex = "/";
export const RouteSignIn = "/signin";
export const RouteSignUp = "/signup";
export const RouteProfile = "/profile";
export const RouteCategoryDetails = "/categories";
export const RouteAddCategory = "/category/add";
export const RouteEditCategory = (category_id) => {
  if (category_id) {
    return `/category/update/${category_id}`;
  } else {
    return "/category/update/:category_id";
  }
};
export const RouteBlog = "/blogs";
export const RouteBlogUsers="/blogs/users";
export const RouteBlogAdd="/blog/add";
export const RouteBlogEdit = (blog_id) => {
  if (blog_id) {
    return `/blogs/update/${blog_id}`;
  }else{
    return "/blogs/update/:blog_id";
  }
}
export const RouteBlogDetails=(category,blog)=>{
  if(!category || !blog){
    return "/blog/:category/:blog";
  }else{
    return `/blog/${category}/${blog}`;
  }

}
export const RouteBlogByCategory=(category)=>{
  if(!category){
    return "/blog/:category";
  }else{
    return `/blog/${category}`;
  }
}
export const RouteSearch=(q)=>{
  if(q){
    return `/search?q=${q}`;
  }else{
    return '/search';
  }
}
export const RouteCommentDetails = "/comments";
export const RouteUsers="/users";