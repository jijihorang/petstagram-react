import styled from "styled-components";

// 스타일을 적용한 버튼 컴포넌트 생성
const StyledButton = styled.button`
    width: ${(props) => props.$width || "100%"};
    padding: ${(props) => props.$padding || '10px'};
    background-color: ${(props) => props.$bgColor || "#7ab3f4"};
    color: ${(props) => props.$color || "#fff"}; 
    border: ${(props) => props.$borderStyle || "none"} ${(props) => props.$borderColor || "transparent"};
    border-radius: 5px;
    cursor: pointer;
`;

const Button = ({
    children,
    onClick,
    bgColor,
    color,
    borderStyle,
    borderColor,
    type,
    width,
    padding
}) => {
    return (
        <StyledButton
            onClick={onClick}
            $bgColor={bgColor} 
            $color={color}
            $borderStyle={borderStyle}
            $borderColor={borderColor}
            type={type}
            $width={width}
            $padding={padding}
        >
            {children}
        </StyledButton>
    );
};

export default Button;
