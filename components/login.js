"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast, Bounce } from "react-toastify";

export default function LoginComponent() {
	const [isShow, setIsShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const HandleSubmit = async (e) => {
		e.preventDefault();

		setIsLoading(true);
		if (username === "" || password === "") {
			toastAlert(
				"error",
				"Could'nt Authorization!",
				"Form masih ada yang kosong!",
				5000
			);
			setIsLoading(false);
		} else {
			signIn("credentials", { username, password, redirect: false }).then(
				async (res) => {
					if (res.error) {
						toast.warning("Username / password anda salah!", {
							position: "top-right",
							autoClose: 3000,
							hideProgressBar: false,
							closeOnClick: false,
							pauseOnHover: true,
							draggable: false,
							progress: undefined,
							theme: "light",
							transition: Bounce,
						});
					} else return (window.location.href = "/dashboard");
					setIsLoading(false);
				}
			);
		}
	};

	return (
		<div className="card absolute objext-cover w-[350px] md:w-[400px] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col gap-3">
			<h1 className="text-center font-bold text-3xl">LOGIN</h1>
			<hr />
			<form
				onSubmit={HandleSubmit}
				method="POST"
				className="flex flex-col gap-3"
			>
				<div className="flex flex-col gap-1">
					<label>Username :</label>
					<input
						type="text"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Masukkan Username"
						className="form-input"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label>Password :</label>
					<div className="flex gap-3">
						<input
							type={isShow ? "text" : "password"}
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Masukkan Password"
							className="form-input flex-1"
						/>
						<button
							type="button"
							className="bg-gray-300 text-gray-500 rounded w-10"
							onClick={() => setIsShow(!isShow)}
						>
							{isShow ? (
								<i className="fa-solid fa-eye-slash my-3.5 mx-2.5"></i>
							) : (
								<i className="fa-solid fa-eye my-3.5 mx-2.5"></i>
							)}
						</button>
					</div>
				</div>
				<button
					type="submit"
					className={`bg-blue-500 hover:bg-blue-700 text-white text-sm rounded p-3 cursor-pointer ${
						isLoading ? "disabled bg-blue-400" : ""
					}`}
				>
					{isLoading ? (
						<>
							<i className="fa-solid fa-spinner animate-spin me-3"></i>
							Loading...
						</>
					) : (
						"LOGIN"
					)}
				</button>
			</form>
			<small className="text-sm text-center text-gray-400">
				<i>Created by Me 2025</i>
			</small>
		</div>
	);
}
