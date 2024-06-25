import config from "../Config/config";

export const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const checkEmailAvailability = async (
  email: string,
  setEmailStatus: (status: string) => void,
  setEmailStatusColor: (color: string) => void
) => {
  try {
    const response = await fetch(`${config.serverUrl}/auth/check-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const text = await response.text();
    try {
      const result = JSON.parse(text);
      if (result.available) {
        setEmailStatus("Email is available");
        setEmailStatusColor("green");
      } else {
        setEmailStatus("Email is already taken");
        setEmailStatusColor("red");
      }
    } catch (error) {
      console.error("Failed to parse JSON:", text);
      setEmailStatus("Error checking email availability");
      setEmailStatusColor("red");
    }
  } catch (error) {
    console.error("Error checking email availability:", error);
    setEmailStatus("Error checking email availability");
    setEmailStatusColor("red");
  }
};

export const checkUsernameAvailability = async (
  username: string,
  setUsernameStatus: (status: string) => void,
  setUsernameStatusColor: (color: string) => void
) => {
  try {
    const response = await fetch(`${config.serverUrl}/auth/check-username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const text = await response.text();
    try {
      const result = JSON.parse(text);
      if (result.available) {
        setUsernameStatus("Username is available");
        setUsernameStatusColor("green");
      } else {
        setUsernameStatus("Username is already taken");
        setUsernameStatusColor("red");
      }
    } catch (error) {
      console.error("Failed to parse JSON:", text);
      setUsernameStatus("Error checking username availability");
      setUsernameStatusColor("red");
    }
  } catch (error) {
    console.error("Error checking username availability:", error);
    setUsernameStatus("Error checking username availability");
    setUsernameStatusColor("red");
  }
};

export const validatePassword = (
  password: string,
  confirmPassword: string,
  setPasswordStatus: (status: string) => void,
  setPasswordStatusColor: (color: string) => void
) => {
  const hasUpperCase = /[A-Z]/.test(password);
  if (password !== confirmPassword) {
    setPasswordStatus("Passwords do not match");
    setPasswordStatusColor("red");
  } else if (!hasUpperCase) {
    setPasswordStatus("Password must contain at least one uppercase letter");
    setPasswordStatusColor("red");
  } else {
    setPasswordStatus("Passwords match");
    setPasswordStatusColor("green");
  }
};

export const handleSignUp = async (
  email: string,
  password: string,
  confirmPassword: string,
  name: string,
  profilePic: string,
  setError: (error: string) => void,
  navigation: any
) => {
  setError("");
  if (!isValidEmail(email)) {
    setError("Invalid email format");
    return;
  }
  if (password.length < 8) {
    setError("Password must be at least 8 characters long");
    return;
  }
  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }
  const hasUpperCase = /[A-Z]/.test(password);
  if (!hasUpperCase) {
    setError("Password must contain at least one uppercase letter");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("nickname", name);
    if (profilePic) {
      const fileName = profilePic.split("/").pop();
      const fileType = profilePic.split(".").pop();
      formData.append("profilePic", {
        uri: profilePic,
        name: fileName,
        type: `image/${fileType}`,
      } as any);
    }

    const response = await fetch(`${config.serverUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    const json = await response.json();
    if (response.status === 201) {
      navigation.navigate("Login");
    } else {
      setError(json.error || "Registration failed");
    }
  } catch (err) {
    setError("Network error or server is down");
  }
};
