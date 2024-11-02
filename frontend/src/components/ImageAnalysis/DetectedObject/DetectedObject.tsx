interface DetectedObjectProps {
  name: string;
  score: number;
  top: number;
  left: number;
  height: number;
  width: number;
}

export function DetectedObject(props: DetectedObjectProps) {
  const {name, score, top, left, height, width} = props;

  const styles = {top, left, height, width};

  return (
    <div
      className="DetectedObject absolute border-4 border-[#00ff00] bg-transparent"
      style={styles}
      data-name={name}
      data-score={`${(score * 100).toFixed(1)}%`}
    />
  )
}