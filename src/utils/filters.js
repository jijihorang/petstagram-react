import icons from "../assets/ImageList";

export const filterImages = {
    none: "",
    kapibara: icons.kapibara,
    dog_filter: icons.dogFilter,
    chilbok: icons.chilbok,
    sunglasses: icons.sunglasses,
};

const filters = {
    none: {
        image: null,
        draw: (predictions, ctx, image) => {},
    },
    kapibara: {
        image: new Image(),
        draw: (predictions, ctx, image) => {
            predictions.forEach((prediction) => {
                const start = prediction.topLeft;
                const end = prediction.bottomRight;
                const size = [end[0] - start[0], end[1] - start[1]];

                ctx.drawImage(
                    image,
                    start[0] - image.width / 2,
                    end[1] - image.height / 4,
                    image.width / 2,
                    image.height / 2
                );
            });
        },
    },
    dog_filter: {
        image: new Image(),
        draw: (predictions, ctx, image) => {
            const earImage = new Image();
            const noseImage = new Image();

            earImage.src = icons.dogEars;
            noseImage.src = icons.dogNose;

            predictions.forEach((prediction) => {
                const start = prediction.topLeft;
                const end = prediction.bottomRight;
                const size = [end[0] - start[0], end[1] - start[1]];

                // 귀 이미지 그리기
                const earWidth = size[0] * 2;
                const earHeight =
                    earWidth * ((earImage.height / earImage.width) * 0.9);
                const earX = start[0] + size[0] / 2 - earWidth / 2;
                const earY = start[1] - earHeight / 2;

                ctx.drawImage(earImage, earX, earY, earWidth, earHeight);

                // 코 이미지 그리기
                const noseWidth = size[0] * 1.5;
                const noseHeight =
                    noseWidth * (noseImage.height / noseImage.width);
                const noseX = start[0] + size[0] / 2 - noseWidth / 2;
                const noseY = start[1] + size[1] / 2 - noseHeight / 1.5;

                ctx.drawImage(noseImage, noseX, noseY, noseWidth, noseHeight);
            });
        },
    },
    chilbok: {
        image: new Image(),
        draw: (predictions, ctx, image) => {
            predictions.forEach((prediction) => {
                const start = prediction.topLeft;
                const end = prediction.bottomRight;
                const size = [end[0] - start[0], end[1] - start[1]];

                const chilbokWidth = size[0] * 1;
                const chilbokHeight =
                    chilbokWidth * (image.height / image.width);
                const chilbokX = start[0] + size[0] / 2 - chilbokWidth / 2;
                const chilbokY = start[1] - chilbokHeight;

                ctx.drawImage(
                    image,
                    chilbokX,
                    chilbokY,
                    chilbokWidth,
                    chilbokHeight
                );
            });
        },
    },
    sunglasses: {
        image: new Image(),
        draw: (predictions, ctx, image) => {
            predictions.forEach((prediction) => {
                const start = prediction.topLeft;
                const end = prediction.bottomRight;
                const landmarks = prediction.landmarks;

                const leftEye = landmarks[0];
                const rightEye = landmarks[1];

                const eyeWidth = rightEye[0] - leftEye[0];
                const sunglassesWidth = eyeWidth * 2.8;
                const sunglassesHeight =
                    sunglassesWidth * (image.height / image.width);
                const sunglassesX =
                    leftEye[0] - (sunglassesWidth - eyeWidth) / 2;
                const sunglassesY = leftEye[1] - sunglassesHeight / 2;

                ctx.drawImage(
                    image,
                    sunglassesX,
                    sunglassesY,
                    sunglassesWidth,
                    sunglassesHeight
                );
            });
        },
    },
};

// 이미지 경로 설정
filters.kapibara.image.src = filterImages.kapibara;
filters.dog_filter.image.src = filterImages.dog_filter;
filters.chilbok.image.src = filterImages.chilbok;
filters.sunglasses.image.src = filterImages.sunglasses;

export const drawFilter = (filterName, predictions, ctx) => {
    const filter = filters[filterName];
    if (filter) {
        if (filter.image === null || filter.image.complete) {
            filter.draw(predictions, ctx, filter.image);
        }
    }
};

export default filters;
