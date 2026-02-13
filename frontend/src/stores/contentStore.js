import { create } from 'zustand';

const useContentStore = create((set) => ({
  posts: [],
  draftPosts: [],
  scheduledPosts: [],
  publishedPosts: [],
  
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  updatePost: (id, updatedPost) => set((state) => ({
    posts: state.posts.map((post) => (post.id === id ? { ...post, ...updatedPost } : post)),
  })),
  deletePost: (id) => set((state) => ({
    posts: state.posts.filter((post) => post.id !== id),
  })),
  
  setPosts: (posts) => set({ posts }),
  setDraftPosts: (posts) => set({ draftPosts: posts }),
  setScheduledPosts: (posts) => set({ scheduledPosts: posts }),
  setPublishedPosts: (posts) => set({ publishedPosts: posts }),
}));

export default useContentStore;