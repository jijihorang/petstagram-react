import icons from "../assets/ImageList";

const filters = {
    catEars: {
        image: new Image(),
        draw: (predictions, ctx, image) => {
            predictions.forEach((prediction) => {
                const leftEye = prediction.landmarks[0];
                const rightEye = prediction.landmarks[1];
                const eyeMidpoint = {
                    x: (leftEye[0] + rightEye[0]) / 2,
                    y: (leftEye[1] + rightEye[1]) / 2,
                };

                const foreheadY = prediction.topLeft[1] - (prediction.bottomRight[1] - prediction.topLeft[1]) / 2;
                const filterWidth = Math.abs(rightEye[0] - leftEye[0]) * 2;
                const filterHeight = filterWidth * (2 / 5);

                ctx.drawImage(
                    image,
                    eyeMidpoint.x - filterWidth / 2,
                    foreheadY,
                    filterWidth,
                    filterHeight
                );
            });
        },
    },
    kapibara: {
        image: new Image(),
        draw: (predictions, ctx, image) => {
            predictions.forEach((prediction) => {
                const { x, y, width, height } = prediction.box;

                const canvasWidth = ctx.canvas.width;
                const canvasHeight = ctx.canvas.height;

                const filterWidth = 300;
                const filterHeight = 300;

                const xPosition = x - filterWidth - 10;
                const yPosition = y + height + 10;

                const adjustedX = Math.max(
                    0,
                    Math.min(xPosition, canvasWidth - filterWidth)
                );
                const adjustedY = Math.max(
                    0,
                    Math.min(yPosition, canvasHeight - filterHeight)
                );

                ctx.drawImage(
                    image,
                    adjustedX,
                    adjustedY,
                    filterWidth,
                    filterHeight
                );
            });
        },
    },
    chilbok: {
        image: new Image(),
        draw: (predictions, ctx, image) => {
            predictions.forEach((prediction) => {
                const { x, y, width, height } = prediction.box;

                const filterWidth = width * 1.5;
                const filterHeight = filterWidth;

                const xPosition = x + width / 2 - filterWidth / 2;
                const yPosition = y - filterHeight - 10;

                ctx.drawImage(
                    image,
                    xPosition,
                    yPosition,
                    filterWidth,
                    filterHeight
                );
            });
        },
    },
    sunglasses: {
        image: new Image(),
        draw: (predictions, ctx, image) => {
            predictions.forEach((prediction) => {
                const leftEye = prediction.landmarks[0];
                const rightEye = prediction.landmarks[1];

                const eyeMidpoint = {
                    x: (leftEye[0] + rightEye[0]) / 2,
                    y: (leftEye[1] + rightEye[1]) / 2,
                };

                const filterWidth = Math.abs(rightEye[0] - leftEye[0]) * 2.5;
                const filterHeight = filterWidth * (2 / 3);
                const xPosition = eyeMidpoint.x - filterWidth / 2;
                const yPosition = eyeMidpoint.y - filterHeight / 2;

                ctx.drawImage(
                    image,
                    xPosition,
                    yPosition,
                    filterWidth,
                    filterHeight
                );
            });
        },
    },
    blackWhite: {
        image: null,
        draw: (predictions, ctx) => {
            const canvasWidth = ctx.canvas.width;
            const canvasHeight = ctx.canvas.height;
            const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
                data[i] = gray;
                data[i + 1] = gray;
                data[i + 2] = gray;
            }

            ctx.putImageData(imageData, 0, 0);
        },
    },
};

filters.catEars.image.src = icons.catEars;
filters.kapibara.image.src = icons.kapibara;
filters.chilbok.image.src = icons.chilbok;
filters.sunglasses.image.src = icons.sunglasses;

export const drawFilter = (filterName, predictions, ctx) => {
    const filter = filters[filterName];
    if (filter) {
        if (filterName === "blackWhite") {
            filter.draw(predictions, ctx);
        } else if (filter.image.complete || filter.image === null) {
            filter.draw(predictions, ctx, filter.image);
        }
    }
};
