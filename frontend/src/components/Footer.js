// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const Footer = () => {
//   const { isAuthenticated } = useAuth();

//   return (
//     <footer style={{
//       background: 'rgba(10,10,25,0.98)',
//       backdropFilter: 'blur(50px)',
//       borderTop: '1px solid rgba(168,85,247,0.3)',
//       padding: '3rem 2rem 1.5rem',
//       color: 'rgba(255,255,255,0.85)',
//       position: 'relative',
//       overflow: 'hidden'
//     }}>
//       {/* Subtle gradient overlay */}
//       <div style={{
//         position: 'absolute',
//         top: 0, left: 0, right: 0, height: '2px',
//         background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)'
//       }} />
      
//       <div style={{ 
//         maxWidth: '1400px', margin: '0 auto', 
//         display: 'flex', flexWrap: 'wrap', 
//         alignItems: 'center', justifyContent: 'space-between',
//         gap: '2rem', fontFamily: 'Inter, -apple-system, sans-serif'
//       }}>
        
//         {/* Logo */}
//         <Link to="/" style={{ 
//           textDecoration: 'none', display: 'flex', 
//           alignItems: 'center', gap: '0.75rem'
//         }}>
//           <div style={{
//             width: '36px', height: '36px',
//             background: 'linear-gradient(135deg, #a855f7, #ec4899)',
//             borderRadius: '12px', display: 'flex',
//             alignItems: 'center', justifyContent: 'center',
//             fontSize: '1.25rem', fontWeight: 'bold'
//           }}>
//             ✨
//           </div>
//           <span style={{
//             fontSize: '1.4rem', fontWeight: '800',
//             background: 'linear-gradient(135deg, #a855f7, #ec4899)',
//             WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
//           }}>
//             PromptHub
//           </span>
//         </Link>

//         {/* Navigation - Minimal */}
//         <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
//           <Link to="/" style={{
//             color: 'rgba(255,255,255,0.9)', textDecoration: 'none',
//             fontWeight: '500', fontSize: '0.95rem', padding: '0.5rem 0',
//             transition: 'all 0.3s ease'
//           }}
//           onMouseEnter={(e) => e.target.style.color = '#a855f7'}
//           onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.9)'}>
//             Home
//           </Link>
          
//           {isAuthenticated && (
//             <Link to="/favorites" style={{
//               color: 'rgba(255,255,255,0.9)', textDecoration: 'none',
//               fontWeight: '500', fontSize: '0.95rem', padding: '0.5rem 0',
//               position: 'relative', transition: 'all 0.3s ease'
//             }}
//             onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
//             onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.9)'}>
//               Favorites
//               <span style={{
//                 position: 'absolute', top: '-8px', right: '-12px',
//                 width: '20px', height: '20px', background: '#fbbf24',
//                 borderRadius: '50%', fontSize: '0.7rem', fontWeight: 'bold',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 opacity: 0, transition: 'all 0.3s ease'
//               }}>
//                 ⭐
//               </span>
//             </Link>
//           )}
//         </div>

//         {/* Creator Credit */}
//         <div style={{
//           textAlign: 'right', opacity: 0.8,
//           fontSize: '0.9rem', lineHeight: '1.4',
//           fontFamily: 'monospace'
//         }}>
//           <div style={{
//             background: 'rgba(168,85,247,0.15)',
//             padding: '0.5rem 1rem', borderRadius: '10px',
//             border: '1px solid rgba(168,85,247,0.3)',
//             display: 'inline-block', marginBottom: '0.25rem',
//             fontWeight: '600', letterSpacing: '-0.02em'
//           }}>
//             Created by Lucky Gole
//           </div>
//           <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
//             with ❤️ in India
//           </div>
//         </div>
//       </div>

//       {/* Bottom line */}
//       <div style={{
//         height: '1px', background: 'rgba(255,255,255,0.08)',
//         marginTop: '2rem', maxWidth: '400px', marginLeft: 'auto',
//         marginRight: 'auto', borderRadius: '1px'
//       }} />
//     </footer>
//   );
// };

// export default Footer;


import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer
      style={{
        background: "#05060a",
        padding: "80px 40px 30px",
        color: "rgba(255,255,255,0.8)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "60px",
        }}
      >
        {/* Logo Section */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "linear-gradient(135deg,#a855f7,#ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              🍌
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "white" }}>
              PromptHub
            </h2>
          </div>

          <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: "1.6" }}>
            Discover quality prompts for AI tools and content creation.
          </p>
        </div>

        {/* Resources */}
        <div>
          <h4
            style={{
              color: "white",
              marginBottom: "18px",
              fontWeight: "600",
              fontSize: "14px",
              letterSpacing: "1px",
            }}
          >
            RESOURCES
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a href="#" style={linkStyle}>
              Blog
            </a>
            <a href="#" style={linkStyle}>
              Changelog
            </a>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4
            style={{
              color: "white",
              marginBottom: "18px",
              fontWeight: "600",
              fontSize: "14px",
              letterSpacing: "1px",
            }}
          >
            COMPANY
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link to="/" style={linkStyle}>
              Home
            </Link>

            {isAuthenticated && (
              <Link to="/favorites" style={linkStyle}>
                Favorites
              </Link>
            )}
          </div>
        </div>

        {/* Legal */}
        <div>
          <h4
            style={{
              color: "white",
              marginBottom: "18px",
              fontWeight: "600",
              fontSize: "14px",
              letterSpacing: "1px",
            }}
          >
            LEGAL
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a href="#" style={linkStyle}>
              Privacy Policy
            </a>
            <a href="#" style={linkStyle}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div
        style={{
          marginTop: "70px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          maxWidth: "1300px",
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: "14px",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        <div>© {new Date().getFullYear()} PromptHub All Rights Reserved.</div>

        <div>Created by Lucky Gole ❤️</div>
      </div>
    </footer>
  );
};

const linkStyle = {
  color: "rgba(255,255,255,0.6)",
  textDecoration: "none",
  fontSize: "14px",
  transition: "0.3s",
};

export default Footer;