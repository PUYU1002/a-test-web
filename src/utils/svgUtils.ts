import { Shape, Vector2 } from 'three';

export interface SVGElement {
  path: string;
  color: string;
  position: [number, number, number];
  scale: number;
  name: string;
  isGenerated?: boolean; // 标记是否为生成的图形
}

// 真正的SVG路径解析器 - 正确处理SVG命令
export function createShapeFromPath(pathData: string): Shape {
  const shape = new Shape();

  // 解析SVG路径命令
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi);
  if (!commands) return shape;

  let currentX = 0;
  let currentY = 0;

  commands.forEach(cmd => {
    const command = cmd[0].toUpperCase();
    const params = cmd.slice(1).trim().split(/[\s,]+/).filter(p => p).map(Number);

    switch (command) {
      case 'M': // MoveTo
        if (params.length >= 2) {
          currentX = params[0];
          currentY = params[1];
          shape.moveTo(currentX, currentY);
        }
        break;

      case 'L': // LineTo
        if (params.length >= 2) {
          currentX = params[0];
          currentY = params[1];
          shape.lineTo(currentX, currentY);
        }
        break;

      case 'C': // Cubic Bezier Curve
        if (params.length >= 6) {
          shape.bezierCurveTo(
            params[0], params[1], // 控制点1
            params[2], params[3], // 控制点2
            params[4], params[5]  // 终点
          );
          currentX = params[4];
          currentY = params[5];
        }
        break;

      case 'V': // Vertical Line
        if (params.length >= 1) {
          currentY = params[0];
          shape.lineTo(currentX, currentY);
        }
        break;

      case 'H': // Horizontal Line
        if (params.length >= 1) {
          currentX = params[0];
          shape.lineTo(currentX, currentY);
        }
        break;

      case 'Z': // Close Path
        shape.closePath();
        break;
    }
  });

  return shape;
}

// 至上主义风格的几何元素配置
export const suprematistElements: SVGElement[] = [
  {
    name: "Black Circle",
    path: "M253.867 125.376C257.372 206.493 191.207 259.57 123.178 259.57C55.1486 259.57 0 201.955 0 130.884C0 59.8129 59.8967 0.195412 127.926 0.195412C193.02 -3.81038 253.867 54.305 253.867 125.376Z",
    color: "#000000",
    position: [0, 0, 0],
    scale: 0.008
  },
  {
    name: "Red Rectangle 1",
    path: "M3.03918 73.7323L0.532891 36.6393L367.453 0.54877L370.461 37.6418L3.03918 73.7323Z",
    color: "#ff0000",
    position: [-1.5, 0.8, 0.3],
    scale: 0.006
  },
  {
    name: "Red Rectangle 2",
    path: "M0.53527 3.03335L39.061 0.531674L81.5895 645.963L47.0664 648.465L0.53527 3.03335Z",
    color: "#cc0000",
    position: [0.5, -1.2, -0.2],
    scale: 0.004
  },
  {
    name: "Red Rectangle 3",
    path: "M0.654203 66.7893L10.6725 90.3323L158.944 23.2096L149.927 0.668397L0.654203 66.7893Z",
    color: "#dd1111",
    position: [-2, -0.5, 0.6],
    scale: 0.01
  },
  {
    name: "Red Rectangle 4",
    path: "M0.672891 19.9454L11.822 44.2708L52.3643 26.0268L43.2423 0.68785L0.672891 19.9454Z",
    color: "#ee2222",
    position: [1.2, 0.3, -0.7],
    scale: 0.015
  },
  {
    name: "Red Rectangle 5",
    path: "M0.672324 93.84L4.67563 102.347L214.849 10.7714V0.763082L0.672324 93.84Z",
    color: "#ff3333",
    position: [0.8, -0.9, 0.4],
    scale: 0.008
  },
  {
    name: "Red Rectangle 6",
    path: "M0.643888 43.8924L111.768 0.649642L126.349 37.3557L15.2257 83.1125L0.643888 43.8924Z",
    color: "#aa0000",
    position: [1.6, 0.6, -0.5],
    scale: 0.012
  }
];

// 将生成的图形转换为SVGElement格式
export function convertGeneratedShapesToSVGElements(shapes: any[]): SVGElement[] {
  return shapes.map((shape, index) => {
    // 转换标准化坐标(0-1)到3D空间坐标
    const x = (shape.center.x - 0.5) * 6; // 扩展到-3到3的范围
    const y = -(shape.center.y - 0.5) * 6; // Y轴翻转并扩展
    const z = (Math.random() - 0.5) * 4; // 随机Z轴位置

    // 根据图形大小调整缩放
    const baseScale = Math.min(shape.bounds.width, shape.bounds.height) * 20;
    const scale = Math.max(0.003, Math.min(0.02, baseScale));

    return {
      path: shape.path || generateDefaultPath(shape),
      color: shape.color,
      position: [x, y, z] as [number, number, number],
      scale: scale,
      name: `Generated ${shape.type} ${index + 1}`,
      isGenerated: true
    };
  });
}

// 为没有path的图形生成默认路径
function generateDefaultPath(shape: any): string {
  const size = 50; // 默认大小

  switch (shape.type) {
    case 'circle':
      return `M ${size} 0 A ${size} ${size} 0 1 0 ${-size} 0 A ${size} ${size} 0 1 0 ${size} 0 Z`;

    case 'triangle':
      return `M 0 ${-size} L ${size * 0.866} ${size * 0.5} L ${-size * 0.866} ${size * 0.5} Z`;

    case 'rectangle':
    default:
      return `M ${-size} ${-size} L ${size} ${-size} L ${size} ${size} L ${-size} ${size} Z`;
  }
} 