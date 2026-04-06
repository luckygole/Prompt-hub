// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { backendURL } from '../helper';
// import './Promptcard.css';

// function showToast(msg, color = '#10b981') {
//   const el = document.createElement('div');
//   el.className = 'bp-toast';
//   el.style.background = color;
//   el.textContent = msg;
//   document.body.appendChild(el);
//   setTimeout(() => {
//     el.style.animation = 'toastOut 0.28s ease forwards';
//     setTimeout(() => el.remove(), 300);
//   }, 2200);
// }

// /* ─── Component ─── */
// const PromptCard = ({ prompt, onLike }) => {
//   const [liked, setLiked] = useState(false);
//   const [likeCount, setLikeCount] = useState(prompt.likes ?? 0);
//   const { isAuthenticated } = useAuth();


//   useEffect(() => {
//     setLiked(prompt.likes > 50);
//     setLikeCount(prompt.likes ?? 0);
//   }, [prompt.likes]);

//   // const handleLike = async (e) => {
//   //   e.stopPropagation();
//   //   if (!isAuthenticated) {
//   //     showToast('Sign in to like prompts 💙', '#6366f1');
//   //     return;
//   //   }
//   //   if (liked) return;
//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     if (!token) { showToast('Please login again!', '#f59e0b'); return; }
//   //     const res = await fetch(`${backendURL}/api/prompts/${prompt._id}/like`, {
//   //       method: 'PATCH',
//   //       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
//   //     });
//   //     if (res.ok) {
//   //       setLiked(true);
//   //       setLikeCount(c => c + 1);
//   //       onLike && onLike(prompt._id);
//   //       showToast('Liked! ❤️', '#ef4444');
//   //     } else {
//   //       showToast('Failed to like. Try again!', '#f59e0b');
//   //     }
//   //   } catch {
//   //     showToast('Network error. Check connection!', '#f59e0b');
//   //   }
//   // };

//   const handleLike = async (e) => {
//   e.stopPropagation();

//   if (!isAuthenticated) {
//     showToast('Sign in to like prompts 💙', '#6366f1');
//     return;
//   }

//   if (liked) return;

//   try {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       showToast('Please login again!', '#f59e0b');
//       return;
//     }

//     const res = await fetch(`${backendURL}/api/prompts/${prompt._id}/like`, {
//       method: 'PATCH',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     const data = await res.json();

//     if (res.ok) {
//       setLiked(true);
//       setLikeCount(data.likes);
//     }

//   } catch {
//     showToast('Network error!', '#f59e0b');
//   }
// };

//   const handleCopy = (e) => {
//     e.stopPropagation();
//     navigator.clipboard.writeText(prompt.prompt);
//     showToast('Copied! 📋', '#10b981');
//   };

//  const handleCreate = (e) => {
//   e.stopPropagation();

//   const encodedPrompt = encodeURIComponent(prompt.prompt);

//   window.open(`https://gemini.google.com/app?q=${encodedPrompt}`, "_blank");
// };

//   const previewText = (prompt?.prompt || 'No prompt available').substring(0, 150) + '...';

//   return (
//     <div className="bp-card">
//       <div className="bp-img-wrap">

//         {/* Image */}
//         {prompt.imageUrl ? (
//           <img
//             src={prompt.imageUrl}
//             alt={prompt.title}
//             onError={(e) => { e.target.style.display = 'none'; }}
//           />
//         ) : (
//           <div className="bp-fallback">✦</div>
//         )}

//         {/* Title badge */}
//         <div className="bp-badge">{prompt.title}</div>

//         {/* Heart button */}
//         <button
//           className={`bp-heart-btn${liked ? ' liked' : ''}`}
//           onClick={handleLike}
//           disabled={liked}
//           title={liked ? 'Liked' : 'Like this prompt'}
//         >
//           <span className="bp-heart-icon">{liked ? '❤️' : '🤍'}</span>
//           <span className="bp-like-count">{likeCount}</span>
//         </button>

//         {/* Text + buttons — transparent overlay at bottom of image */}
//         <div className="bp-overlay-body">
//           <p className="bp-prompt-text">{previewText}</p>
//           <div className="bp-actions">
//             <button className="bp-btn bp-btn-copy" onClick={handleCopy}>
//               📋 Copy
//             </button>
//             <button className="bp-btn bp-btn-create" onClick={handleCreate}>
//               Create
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default PromptCard;


import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { backendURL } from '../helper';
import './Promptcard.css';

// 🔔 Toast
function showToast(msg, color = '#10b981') {
  const el = document.createElement('div');
  el.className = 'bp-toast';
  el.style.background = color;
  el.textContent = msg;
  document.body.appendChild(el);

  setTimeout(() => {
    el.style.animation = 'toastOut 0.28s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, 2000);
}

/* ─── Component ─── */
const PromptCard = ({ prompt }) => {
  const { isAuthenticated } = useAuth();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(prompt.likes || 0);
  const [loadingLike, setLoadingLike] = useState(false);

  // ✅ Sync with backend data
  useEffect(() => {
    setLikeCount(prompt.likes || 0);
  }, [prompt.likes]);

  // ❤️ HANDLE LIKE
  const handleLike = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Login to like 💙', '#6366f1');
      return;
    }

    if (liked || loadingLike) return;

    setLoadingLike(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Login again!', '#f59e0b');
        setLoadingLike(false);
        return;
      }

      const res = await fetch(`${backendURL}/api/prompts/${prompt._id}/like`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (res.ok) {
        // 🔥 update from backend (source of truth)
        setLiked(true);
        setLikeCount(data.likes);
        showToast('Liked ❤️', '#ef4444');
      } else {
        showToast(data.message || 'Already liked', '#f59e0b');
      }

    } catch (err) {
      console.error(err);
      showToast('Network error', '#f59e0b');
    } finally {
      setLoadingLike(false);
    }
  };

  // 📋 COPY
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt);
    showToast('Copied! 📋');
  };

  // 🚀 CREATE (Gemini)
  const handleCreate = (e) => {
    e.stopPropagation();
    const encodedPrompt = encodeURIComponent(prompt.prompt);
    window.open(`https://gemini.google.com/app?q=${encodedPrompt}`, "_blank");
  };

  const previewText =
    (prompt?.prompt || 'No prompt available').substring(0, 150) + '...';

  return (
    <div className="bp-card">
      <div className="bp-img-wrap">

        {/* 🖼️ IMAGE */}
        {prompt.imageUrl ? (
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="bp-fallback">✦</div>
        )}

        {/* 🏷️ TITLE */}
        <div className="bp-badge">{prompt.title}</div>

        {/* ❤️ LIKE BUTTON */}
        <button
          className={`bp-heart-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={liked || loadingLike}
        >
          <span className="bp-heart-icon">
            {liked ? '❤️' : '🤍'}
          </span>
          <span className="bp-like-count">
            {likeCount}
          </span>
        </button>

        {/* 📝 TEXT + ACTIONS */}
        <div className="bp-overlay-body">
          <p className="bp-prompt-text">{previewText}</p>

          <div className="bp-actions">
            <button className="bp-btn bp-btn-copy" onClick={handleCopy}>
              📋 Copy
            </button>

            <button className="bp-btn bp-btn-create" onClick={handleCreate}>
              Create
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PromptCard;