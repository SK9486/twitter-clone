import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { useState } from "react";


const NotificationPage = () => {
	const queryClient = useQueryClient();
	const {data, isLoading} = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notifications/", {
					method: "GET",
				});
				if (!res.ok) {
					throw new Error("Failed to fetch notifications");
				}
				const data = await res.json();
				return data;
			} catch (error) {
				console.log("Error fetching notifications", error.message);
			}
		},
	});

	const { mutate: deleteNotification, isPending } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/notifications/`, {
					method: "DELETE",
				});
				if (!res.ok) {
					throw new Error("Failed to delete notification");
				}
				const data = await res.json();
				return data;
			} catch (err) {
				throw new Error(err.message);
			}
		},
		onSuccess: () => {
			toast.success("Notification deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete notification");
		}
	});

	const deleteNotifications = () => {
		document.getElementById('my_modal_4').showModal();
	};

	const handleDelete = () => {
		deleteNotification();
		document.getElementById('my_modal_4').close(); // Close the modal after deletion
	}

	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{data?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{data?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
						</div>
					</div>
				))}

				<dialog id="my_modal_4" className="modal">
					<div className="modal-box w-4/12 max-w-5xl border border-gray-700">
						<h3 className="font-bold text-lg">Are you sure ❓</h3>
						<p className="py-4">Delete all notifications</p>
						<div className="modal-action">
							<form method="dialog">
								{/* if there is a button, it will close the modal */}
								<button className="btn mr-10">Close</button>
								<button className="btn btn-primary" onClick={handleDelete}>Delete</button>
							</form>
						</div>
					</div>
				</dialog>
			</div>
		</>
	);
};

export default NotificationPage;
