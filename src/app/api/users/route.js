let users = [
  {
    id: 1,
    name: "Alice Johnson",
    photo:
      "https://i.pinimg.com/736x/ff/ea/8f/ffea8fc7a4b2137d9b7895fac19632f1.jpg",
    uniqueIdNumber: "EMP-2026-001",
    dateOfBirth: "1998-04-12",
    expiryDate: "2030-04-12",
    signature: "AliceJohnsonSign",
    gender: "Female",
    address: "Phnom Penh",
    nationality: "Cambodian",
    phoneNumber: "+85512345678",
    email: "alice@example.com",
    bloodType: "A+",
    emergencyContact: {
      name: "John Johnson",
      phone: "+85598765432",
    },
    issuedDate: "2025-04-12",
    issuingAuthority: "Ministry",
  },
  {
    id: 2,
    name: "David Chen",
    photo:
      "https://i.pinimg.com/736x/8c/cd/20/8ccd2064d0527f302d0b9fbbb4cca4e3.jpg",
    uniqueIdNumber: "EMP-2026-002",
    dateOfBirth: "1995-09-21",
    expiryDate: "2030-09-21",
    signature: "DavidChenSign",
    gender: "Male",
    address: "Siem Reap",
    nationality: "Cambodian",
    phoneNumber: "+85511223344",
    email: "david.chen@example.com",
    bloodType: "B+",
    emergencyContact: {
      name: "Sokha Chen",
      phone: "+85599887766",
    },
    issuedDate: "2025-09-21",
    issuingAuthority: "Ministry",
  },
  {
    id: 3,
    name: "Vicheka Sok",
    photo:
      "https://i.pinimg.com/736x/3f/1c/11/3f1c114b5a2b267c7355027cac11e9d2.jpg",
    uniqueIdNumber: "EMP-2026-003",
    dateOfBirth: "2000-02-15",
    expiryDate: "2030-02-15",
    signature: "VichekaSokSign",
    gender: "Female",
    address: "Battambang",
    nationality: "Cambodian",
    phoneNumber: "+85577665544",
    email: "vicheka.sok@example.com",
    bloodType: "O-",
    emergencyContact: {
      name: "Dara Sok",
      phone: "+85566554433",
    },
    issuedDate: "2025-02-15",
    issuingAuthority: "Ministry",
  },
];

// GET
export async function GET() {
  return Response.json(users);
}

// POST
export async function POST(req) {
  const body = await req.json();

  const newUser = {
    id: Date.now(),
    ...body,
  };

  users.push(newUser);
  return Response.json(newUser);
}

// PUT
export async function PUT(req) {
  const body = await req.json();

  users = users.map((u) =>
    u.id === body.id
      ? {
          ...u,
          ...body,
        }
      : u,
  );

  return Response.json({ success: true });
}

// DELETE
export async function DELETE(req) {
  const body = await req.json();

  users = users.filter((u) => u.id !== body.id);

  return Response.json({ success: true });
}
