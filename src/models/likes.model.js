import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        },
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        tweet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tweet",
        },
    },
    {
        timestamps: true,
    }
);

// pre hook that check for if the user has already liked or not - if yes then gives error

// likeSchema.pre("save", async function () {
//     let checkLike;
//     if (this.video) {
//         checkLike = await Likes.findOne({
//             video: this.video,
//             likedBy: this.likedBy,
//         });
//     } else if (this.tweet) {
//         checkLike = await Likes.findOne({
//             tweet: this.tweet,
//             likedBy: this.likedBy,
//         });
//     } else if (this.comment) {
//         checkLike = await Likes.findOne({
//             comment: this.comment,
//             likedBy: this.likedBy,
//         });
//     } else {
//         throw new Error(
//             "A like must be associated with comment , video or tweet"
//         );
//     }

//     if (checkLike) {
//         let item = "item";
//         if (this.video) {
//             item = "Video";
//         } else if (this.comment) {
//             item = "Comment";
//         } else if (this.tweet) {
//             item = "Tweet";
//         }
//         let errorMessage = `Already liked this ${item}`;
//         throw new Error(errorMessage);
//     }
// });

export const Likes = mongoose.model("Likes", likeSchema);
