'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile, changeUsername, deleteUserAccount, isValidUsername, isUsernameAvailable } from "@/lib/db";
import { deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);
  useEffect(() => {
    if (user) getUserProfile(user.uid).then(p => {
      setProfile(p);
      setNewUsername(p?.username || "");
    });
  }, [user]);

  async function checkUsername(val: string) {
    setNewUsername(val);
    setUsernameError("");
    setUsernameSuccess("");
    if (val === profile?.username) return;
    const valid = isValidUsername(val);
    if (!valid.valid) { setUsernameError(valid.error || "Invalid username"); return; }
    setCheckingUsername(true);
    const available = await isUsernameAvailable(val.toLowerCase());
    setCheckingUsername(false);
    if (!available) setUsernameError("Username is already taken.");
    else setUsernameSuccess("Username is available!");
  }

  async function handleUsernameChange() {
    if (!user || !profile) return;
    if (newUsername === profile.username) return;
    setSavingUsername(true);
    const result = await changeUsername(user.uid, profile.username, newUsername);
    setSavingUsername(false);
    if (result.error) { setUsernameError(result.error); }
    else { setUsernameSuccess("Username updated!"); setProfile((p: any) => ({ ...p, username: newUsername.toLowerCase() })); }
  }

  async function handleDeleteAccount() {
    if (!user) { alert("Not logged in"); return; }
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      const username = profile?.username || "";
      await deleteUserAccount(user.uid, username);
      // Delete Firebase Auth account
      try {
        await deleteUser(auth.currentUser!);
      } catch (authErr: any) {
        if (authErr.code === "auth/requires-recent-login") {
          // Sign out and redirect — data is already deleted
          await signOut();
          router.push("/?deleted=true");
          return;
        }
        throw authErr;
      }
      await signOut();
      router.push("/?deleted=true");
    } catch (e: any) {
      console.error("Delete error:", e);
      alert("Something went wrong: " + e.message);
      setDeleting(false);
    }
  }

  const inp: React.CSSProperties = {width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #e0e0e0",fontSize:14,fontFamily:"inherit",fontWeight:500,color:"#000",background:"#fff"};

  return (
    <div style={{minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000"}}>
      <style>{css}</style>
      <div style={{maxWidth:600,margin:"0 auto",padding:"32px 24px 80px"}}>
        <button onClick={()=>router.push("/dashboard")} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em"}}><ArrowLeft/> Back</button>
        <h1 style={{fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4}}>Settings</h1>
        <p style={{fontSize:15,opacity:.5,fontWeight:500,marginBottom:32}}>Manage your account settings.</p>

        {/* Account Info */}
        <div style={{padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16}}>
          <div style={{fontSize:15,fontWeight:900,marginBottom:16}}>Account</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f5f5f5"}}>
              <span style={{fontSize:13,fontWeight:600,opacity:.5}}>Email</span>
              <span style={{fontSize:13,fontWeight:700}}>{user?.email||"—"}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0"}}>
              <span style={{fontSize:13,fontWeight:600,opacity:.5}}>Member since</span>
              <span style={{fontSize:13,fontWeight:700}}>{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "—"}</span>
            </div>
          </div>
        </div>

        {/* Change Username */}
        <div style={{padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16}}>
          <div style={{fontSize:15,fontWeight:900,marginBottom:4}}>Change Username</div>
          <p style={{fontSize:13,opacity:.5,marginBottom:16}}>Your public profile URL: joingemm.com/{newUsername||profile?.username}</p>
          <div style={{position:"relative",marginBottom:8}}>
            <input
              value={newUsername}
              onChange={e=>checkUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))}
              placeholder="username"
              maxLength={20}
              style={{...inp,paddingRight:checkingUsername?"40px":"12px"}}
            />
            {checkingUsername && <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:11,opacity:.4}}>...</div>}
          </div>
          {usernameError && <p style={{fontSize:12,color:"#ef4444",fontWeight:600,marginBottom:8}}>{usernameError}</p>}
          {usernameSuccess && <p style={{fontSize:12,color:"#22c55e",fontWeight:600,marginBottom:8}}>{usernameSuccess}</p>}
          <button
            onClick={handleUsernameChange}
            disabled={savingUsername||!!usernameError||newUsername===profile?.username||checkingUsername}
            style={{padding:"10px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:savingUsername||!!usernameError||newUsername===profile?.username||checkingUsername?0.4:1}}
          >
            {savingUsername?"Saving...":"Update Username"}
          </button>
        </div>

        {/* Danger Zone */}
        <div style={{padding:24,borderRadius:16,border:"1px solid #fecaca",background:"#fff"}}>
          <div style={{fontSize:15,fontWeight:900,color:"#dc2626",marginBottom:4}}>Danger Zone</div>
          <p style={{fontSize:13,opacity:.5,marginBottom:16}}>Permanently delete your account. Your username will be reserved for 30 days.</p>
          <button
            onClick={()=>setShowDeleteModal(true)}
            style={{padding:"10px 20px",borderRadius:8,background:"#fee2e2",color:"#dc2626",border:"1px solid #fecaca",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
          >
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:24}}>
            <div style={{background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,0.2)"}}>
              <div style={{fontSize:20,fontWeight:900,marginBottom:8}}>Delete Account</div>
              <p style={{fontSize:14,opacity:.6,marginBottom:8,lineHeight:1.5}}>This will permanently delete your account and all your data. Your username <strong>@{profile?.username}</strong> will be reserved for 30 days.</p>
              <p style={{fontSize:13,fontWeight:700,marginBottom:8}}>Type <strong>DELETE</strong> to confirm:</p>
              <input
                value={deleteConfirm}
                onChange={e=>setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE"
                style={{...inp,marginBottom:16,borderColor:deleteConfirm==="DELETE"?"#ef4444":"#e0e0e0"}}
              />
              <div style={{display:"flex",gap:8}}>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm!=="DELETE"||deleting}
                  style={{flex:1,padding:"12px",borderRadius:10,background:"#dc2626",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:deleteConfirm!=="DELETE"||deleting?0.4:1}}
                >
                  {deleting?"Deleting...":"Delete My Account"}
                </button>
                <button
                  onClick={()=>{setShowDeleteModal(false);setDeleteConfirm("");}}
                  style={{flex:1,padding:"12px",borderRadius:10,background:"#f5f5f5",color:"#666",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}