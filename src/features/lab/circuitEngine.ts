import type { CircuitComponent, CircuitSimulationState } from './types';

export function solveCircuit(components: CircuitComponent[]): CircuitSimulationState {
  if (components.length === 0) {
    return {
      isClosed: false,
      isShortCircuit: false,
      totalVoltage: 0,
      totalResistance: 0,
      current: 0,
      bulbBrightness: 0,
      isBulbBurnt: false,
      statusMessage: 'Mạch điện chưa có linh kiện nào. Hãy thêm pin và bóng đèn vào mạch!',
    };
  }

  const batteries = components.filter((c) => c.type === 'battery');
  const switches = components.filter((c) => c.type === 'switch');
  const bulbs = components.filter((c) => c.type === 'bulb');
  const resistors = components.filter((c) => c.type === 'resistor');

  // Check if switch is open
  const hasOpenSwitch = switches.some((s) => !s.state);
  if (hasOpenSwitch) {
    return {
      isClosed: false,
      isShortCircuit: false,
      totalVoltage: batteries.reduce((acc, b) => acc + b.value, 0),
      totalResistance: bulbs.reduce((acc, b) => acc + b.value, 0) + resistors.reduce((acc, r) => acc + r.value, 0),
      current: 0,
      bulbBrightness: 0,
      isBulbBurnt: false,
      statusMessage: 'Công tắc đang NGẮT. Mạch hở, không có dòng điện chạy qua.',
    };
  }

  // Need at least 1 battery to have a circuit
  if (batteries.length === 0) {
    return {
      isClosed: true,
      isShortCircuit: false,
      totalVoltage: 0,
      totalResistance: bulbs.reduce((acc, b) => acc + b.value, 0) + resistors.reduce((acc, r) => acc + r.value, 0),
      current: 0,
      bulbBrightness: 0,
      isBulbBurnt: false,
      statusMessage: 'Chưa có nguồn điện (pin). Hãy lắp thêm pin để cấp điện áp cho mạch!',
    };
  }

  const totalVoltage = batteries.reduce((acc, b) => acc + b.value, 0);
  const totalResistance =
    bulbs.reduce((acc, b) => acc + b.value, 0) + resistors.reduce((acc, r) => acc + r.value, 0);

  // Short circuit check: voltage > 0 but total resistance = 0
  if (totalResistance === 0) {
    return {
      isClosed: true,
      isShortCircuit: true,
      totalVoltage,
      totalResistance: 0,
      current: 99.9,
      bulbBrightness: 0,
      isBulbBurnt: false,
      statusMessage: 'CẢNH BÁO ĐOẢN MẠCH! Nguồn điện nối trực tiếp không qua điện trở/bóng đèn. Cầu chì tự động ngắt!',
    };
  }

  // Ohm's Law: I = U / R
  const current = Number((totalVoltage / totalResistance).toFixed(2));

  // Bulb behavior
  // Standard 3V bulb has R = 10Ω, rated current = 0.3A
  let isBulbBurnt = false;
  let bulbBrightness = 0;

  if (bulbs.length > 0) {
    if (current > 1.2) {
      // Overcurrent burns filament
      isBulbBurnt = true;
      bulbBrightness = 0;
    } else {
      // Scale brightness between 0.2 (dim) and 1.0 (full brightness)
      bulbBrightness = Math.min(1.0, Math.max(0.15, current / 0.5));
    }
  }

  let statusMessage = '';
  if (isBulbBurnt) {
    statusMessage = `Dòng điện quá lớn (I = ${current}A > 1.2A)! Dây tóc bóng đèn đã bị cháy đứt do quá tải.`;
  } else if (bulbs.length > 0) {
    if (current >= 0.25) {
      statusMessage = `Mạch kín hoạt động tốt! Dòng điện I = ${current}A. Bóng đèn sáng rõ rực rỡ.`;
    } else {
      statusMessage = `Mạch kín có dòng điện I = ${current}A. Điện trở lớn nên bóng đèn sáng mờ.`;
    }
  } else {
    statusMessage = `Mạch kín ổn định. Điện áp U = ${totalVoltage}V, Dòng điện I = ${current}A.`;
  }

  return {
    isClosed: true,
    isShortCircuit: false,
    totalVoltage,
    totalResistance,
    current,
    bulbBrightness,
    isBulbBurnt,
    statusMessage,
  };
}
