import { useState, useEffect, FormEvent } from "react";
import { UserAccount } from "../types";
import { Shield, User, Lock, Eye, EyeOff, LogIn, Laptop, Smartphone, Download, Check, AlertCircle, Mail, KeyRound, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Recovery States
  const [isRecovery, setIsRecovery] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: username/email, 2: 6-digit code, 3: new password
  const [recoveryUsername, setRecoveryUsername] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [simulatedMailToast, setSimulatedMailToast] = useState<{ email: string; code: string } | null>(null);

  // Load and initialize users from localStorage
  useEffect(() => {
    // Exact 3 accounts requested by the user
    const defaultAccounts: UserAccount[] = [
      {
        username: "ncarrasco",
        passwordHash: btoa("aguacol2026"),
        fullName: "N. Carrasco",
        createdAt: new Date().toISOString(),
      },
      {
        username: "doteiza",
        passwordHash: btoa("operaciones2026"),
        fullName: "D. Oteiza",
        createdAt: new Date().toISOString(),
      },
      {
        username: "mbecerra",
        passwordHash: btoa("aguacol 2026"), // exact password with space inside
        fullName: "M. Becerra",
        createdAt: new Date().toISOString(),
      }
    ];

    const existingUsers = localStorage.getItem("_aguacol_users");
    if (!existingUsers) {
      localStorage.setItem("_aguacol_users", JSON.stringify(defaultAccounts));
    } else {
      // Guarantee they always exist in the options list
      const usersList: UserAccount[] = JSON.parse(existingUsers);
      let listUpdated = false;
      defaultAccounts.forEach((acc) => {
        if (!usersList.some((u) => u.username.toLowerCase() === acc.username)) {
          usersList.push(acc);
          listUpdated = true;
        }
      });
      if (listUpdated) {
        localStorage.setItem("_aguacol_users", JSON.stringify(usersList));
      }
    }

    // Detect if already running as installed PWA (standalone mode)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsPwaInstalled(true);
    }

    // Capture install prompt for PWA installation
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleAuth = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Por favor, ingrese su usuario de acceso y su clave.");
      return;
    }

    const trimmedUser = username.trim().toLowerCase();
    const existingUsersRaw = localStorage.getItem("_aguacol_users") || "[]";
    const usersList: UserAccount[] = JSON.parse(existingUsersRaw);

    // LOGIN FLOW ONLY
    const matchedUser = usersList.find(
      (u) => u.username.toLowerCase() === trimmedUser && u.passwordHash === btoa(password)
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
    } else {
      setErrorMessage("Usuario o contraseña incorrectos. Verifique sus credenciales con el administrador.");
    }
  };

  // Start the recovery process
  const handleInitiateRecovery = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!recoveryUsername.trim() || !recoveryEmail.trim()) {
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }

    const trimmedUser = recoveryUsername.trim().toLowerCase();
    const existingUsersRaw = localStorage.getItem("_aguacol_users") || "[]";
    const usersList: UserAccount[] = JSON.parse(existingUsersRaw);

    const matchedUser = usersList.find((u) => u.username.toLowerCase() === trimmedUser);
    if (!matchedUser) {
      setErrorMessage("El nombre de usuario ingresado no corresponde a un administrador activo.");
      return;
    }

    // Generate random 6 DIGIT code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(randomCode);

    // Trigger visual toast simulating SMTP email receipt
    setSimulatedMailToast({ email: recoveryEmail.trim(), code: randomCode });
    setSuccessMessage(`¡Código de verificación enviado a ${recoveryEmail}!`);
    setTimeout(() => {
      setRecoveryStep(2);
      setSuccessMessage("");
    }, 1500);
  };

  // Verify code input
  const handleVerifyCode = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (inputCode.trim() !== generatedCode) {
      setErrorMessage("Código numérico incorrecto. Verifique el código enviado.");
      return;
    }

    setSuccessMessage("¡Código verificado exitosamente!");
    setSimulatedMailToast(null); // Clear simulated mail notification
    setTimeout(() => {
      setRecoveryStep(3);
      setSuccessMessage("");
    }, 1000);
  };

  // Update password in database
  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Las contraseñas ingresadas no coinciden.");
      return;
    }

    const trimmedUser = recoveryUsername.trim().toLowerCase();
    const existingUsersRaw = localStorage.getItem("_aguacol_users") || "[]";
    const usersList: UserAccount[] = JSON.parse(existingUsersRaw);

    const updatedList = usersList.map((u) => {
      if (u.username.toLowerCase() === trimmedUser) {
        return {
          ...u,
          passwordHash: btoa(newPassword)
        };
      }
      return u;
    });

    localStorage.setItem("_aguacol_users", JSON.stringify(updatedList));
    setSuccessMessage("¡Nueva contraseña guardada con éxito!");

    // Set credentials for easy login entry
    setUsername(trimmedUser);
    setPassword("");

    setTimeout(() => {
      // Reset recovery flow
      setIsRecovery(false);
      setRecoveryStep(1);
      setRecoveryUsername("");
      setRecoveryEmail("");
      setGeneratedCode("");
      setInputCode("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSuccessMessage("");
    }, 2000);
  };

  const triggerInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setIsPwaInstalled(true);
        setInstallPrompt(null);
      }
    } else {
      alert(
        "💡 Instalar en tu dispositivo:\n\n" +
        "• En Chrome / Edge (PC/Mac): Haz clic en el ícono de descarga que aparece en la barra de direcciones en la esquina superior derecha.\n\n" +
        "• En iOS (iPhone/iPad): Pulsa el botón 'Compartir' en Safari y selecciona 'Agregar a pantalla de inicio'.\n\n" +
        "• En Android: Abre el menú de tres puntos en el navegador y pulsa 'Instalar aplicación'."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-900 text-slate-100 overflow-y-auto no-print px-4 py-8 relative">
      {/* Subtle decorative color blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with brand logo */}
      <header className="w-full max-w-md mx-auto text-center mb-6">
        <div className="inline-flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 text-slate-950 fill-none stroke-[2]"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" fill="currentColor" fillOpacity="0.15" />
              <path d="m9 14.2 2 2 4-4" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent uppercase">
              Etiquetas Aguacol
            </h1>
          </div>
        </div>
      </header>

      {/* Simulación del servidor de correo */}
      <AnimatePresence>
        {simulatedMailToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-cyan-950 border border-cyan-500 rounded-xl p-4 shadow-xl z-50 text-slate-100 text-xs no-print"
          >
            <div className="flex items-start gap-2.5">
              <Mail className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0 animate-bounce" />
              <div>
                <h4 className="font-bold text-cyan-200">📬 Simulación de Servidor de Correo</h4>
                <p className="text-slate-300 mt-0.5">
                  Correo enviado exitosamente a <strong className="text-emerald-400">{simulatedMailToast.email}</strong>.
                </p>
                <div className="mt-2 bg-slate-900/80 p-2 rounded border border-cyan-800 text-center">
                  <span className="text-[10px] uppercase font-mono text-cyan-400 block tracking-wider">Código de Seguridad (6 dígitos)</span>
                  <span className="text-lg font-mono font-bold text-emerald-400 tracking-widest">{simulatedMailToast.code}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-snug">
                  * En ambiente de pruebas, simulamos el despacho SMTP mostrando el código directamente en pantalla para que pueda copiarlo y cambiar su clave ahora mismo.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main card box */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center my-4 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700/60 shadow-2xl"
        >
          {/* RECOVERY VIEW */}
          {isRecovery ? (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => {
                    setIsRecovery(false);
                    setRecoveryStep(1);
                    setErrorMessage("");
                    setSuccessMessage("");
                    setSimulatedMailToast(null);
                  }}
                  className="p-1 px-2.5 bg-slate-705 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver</span>
                </button>
                <span className="text-xs text-slate-500 font-mono">Paso {recoveryStep} de 3</span>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-slate-150">
                  {recoveryStep === 1 && "Recuperación de Clave"}
                  {recoveryStep === 2 && "Validación de Código"}
                  {recoveryStep === 3 && "Establecer Nueva Clave"}
                </h2>
                <p className="text-sm text-slate-400 mt-1 leading-snug">
                  {recoveryStep === 1 && "Ingrese su usuario administrativo y un correo para recibir un código de seguridad de 6 dígitos."}
                  {recoveryStep === 2 && "Ingrese el código de 6 dígitos que fue enviado de manera segura a su casilla de correo."}
                  {recoveryStep === 3 && "Escriba una nueva contraseña segura para acceder a su estación de control."}
                </p>
              </div>

              {/* STEP 1: Enter Username & Target Mail */}
              {recoveryStep === 1 && (
                <form onSubmit={handleInitiateRecovery} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
                      Usuario
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-sm transition-all text-slate-100 placeholder-slate-500"
                        placeholder="Ingrese su usuario"
                        value={recoveryUsername}
                        onChange={(e) => setRecoveryUsername(e.target.value)}
                        autoCapitalize="none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
                      Correo Destinatario
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-sm transition-all text-slate-100 placeholder-slate-500"
                        placeholder="Ej. tu-nombre@aguacol.cl"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 bg-red-950/60 border border-red-800 text-red-200 px-3 py-2.5 rounded-xl text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                      <p className="leading-snug">{errorMessage}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800 text-emerald-200 px-3 py-2.5 rounded-xl text-xs">
                      <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                      <p className="leading-snug">{successMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Mail className="w-4 h-4" />
                    Enviar Código de Seguridad
                  </button>
                </form>
              )}

              {/* STEP 2: Input and Confirm 6-digit numeric code */}
              {recoveryStep === 2 && (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 text-center">
                      Código de 6 Dígitos
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-emerald-400 placeholder-slate-600"
                        placeholder="••••••"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.replace(/[^0-9]/g, ""))}
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 bg-red-950/60 border border-red-800 text-red-200 px-3 py-2.5 rounded-xl text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                      <p className="leading-snug">{errorMessage}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800 text-emerald-200 px-3 py-2.5 rounded-xl text-xs">
                      <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                      <p className="leading-snug">{successMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Verificar Código
                  </button>
                </form>
              )}

              {/* STEP 3: Enter new Password and save */}
              {recoveryStep === 3 && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-sm transition-all text-slate-100 placeholder-slate-500"
                        placeholder="Mínimo 6 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-sm transition-all text-slate-100 placeholder-slate-500"
                        placeholder="Repita la nueva contraseña"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 bg-red-950/60 border border-red-800 text-red-200 px-3 py-2.5 rounded-xl text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                      <p className="leading-snug">{errorMessage}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800 text-emerald-200 px-3 py-2.5 rounded-xl text-xs">
                      <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                      <p className="leading-snug">{successMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Guardar Nueva Contraseña
                  </button>
                </form>
              )}
            </div>
          ) : (
            // STANDARD LOGIN CARDS
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-slate-150">
                  Acceso de Inspectores
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Inicie sesión con su credencial registrada
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {/* Username / Email field */}
                <div>
                  <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
                    Usuario
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-sm transition-all text-slate-100 placeholder-slate-500"
                      placeholder="Ingrese su usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoCapitalize="none"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">
                    Clave de Seguridad
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-sm transition-all text-slate-100 placeholder-slate-500"
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Alerts & Errors feedback */}
                {errorMessage && (
                  <div className="flex items-center gap-2 bg-red-950/60 border border-red-800 text-red-200 px-3 py-2.5 rounded-xl text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                    <p className="leading-snug">{errorMessage}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800 text-emerald-200 px-3 py-2.5 rounded-xl text-xs">
                    <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                    <p className="leading-snug">{successMessage}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </button>
              </form>

              {/* Prompt swap switcher for Recovery */}
              <div className="text-center mt-6 pt-5 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecovery(true);
                    setRecoveryStep(1);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  className="text-xs text-cyan-450 hover:text-cyan-400 font-medium transition-colors cursor-pointer"
                >
                  He olvidado mi contraseña
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Download and Offline Installation Panel */}
      <footer className="w-full max-w-md mx-auto text-center mt-6">
        <div className={`bg-slate-850 p-4 rounded-xl border shadow ${isPwaInstalled ? 'border-emerald-800/60' : 'border-slate-800/80'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPwaInstalled ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-emerald-400'}`}>
              {isPwaInstalled ? <Check className="w-4.5 h-4.5" /> : <Download className="w-4.5 h-4.5" />}
            </div>
            <div className="text-left flex-1">
              {isPwaInstalled ? (
                <>
                  <h4 className="text-xs font-semibold text-emerald-400">✅ Aplicación Instalada</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">La app ya está instalada en este dispositivo. No es necesario reinstalar.</p>
                </>
              ) : (
                <>
                  <h4 className="text-xs font-semibold text-slate-250">Instalar en Dispositivos</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">Agregue esta app como PWA para acceso instantáneo offline.</p>
                </>
              )}
            </div>
            {!isPwaInstalled && (
              <button
                onClick={triggerInstall}
                type="button"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 active:bg-slate-900 border border-slate-700 text-xs font-medium rounded-lg text-emerald-400 cursor-pointer flex items-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Instalar
              </button>
            )}
          </div>

          {!isPwaInstalled && (
            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5 justify-center">
                <Laptop className="w-3.5 h-3.5 text-slate-500" />
                <span>Soporte PC, Mac y Linux</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>iPhone, iPad y Android</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-[10px] text-slate-500 mt-4 text-center">
          AGUACOL SpA
        </p>
      </footer>
    </div>
  );
}
