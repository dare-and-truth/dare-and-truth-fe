import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react'; // Sử dụng biểu tượng vương miện từ lucide-react

// Dữ liệu mẫu
const topUsers = [
  { name: 'Maili', score: '1M', avatar: '/avatars/maili.jpg', rank: 2 },
  { name: 'Lam Nat', score: '1.2M', avatar: '/avatars/lamnat.jpg', rank: 1 },
  {
    name: 'Thanh Van',
    score: '700K',
    avatar: '/avatars/thanhvan.jpg',
    rank: 3,
  },
];

const nearbyUsers = [
  { name: 'Melvyn', rank: 30, score: 31, avatar: '/avatars/melvyn.jpg' },
  { name: 'Linh Nguyen Thi', rank: 35, score: 28, avatar: '/avatars/linh.jpg' },
  { name: 'Julia Clover', rank: 50, score: 21, avatar: '/avatars/julia.jpg' },
  {
    name: 'Carrie Henderson',
    rank: 40,
    score: 20,
    avatar: '/avatars/carrie.jpg',
  },
];

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      {/* Top 3 Section */}
      <div className="mb-8 flex items-end justify-center space-x-4">
        {topUsers.map((user, index) => (
          <div
            key={user.name}
            className={`flex flex-col items-center ${
              user.rank === 1
                ? 'order-1'
                : user.rank === 2
                  ? 'order-0'
                  : 'order-2'
            }`}
          >
            <div className="relative">
              <Avatar
                className={`${
                  user.rank === 1 ? 'h-24 w-24' : 'h-16 w-16'
                } border-4 ${user.rank === 1 ? 'border-yellow-400' : 'border-gray-500'}`}
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              {user.rank === 1 && (
                <Crown className="absolute -top-2 left-1/2 h-8 w-8 -translate-x-1/2 transform text-yellow-400" />
              )}
            </div>
            <p className="mt-2 font-semibold">{user.name}</p>
            <p className="text-sm text-gray-400">{user.score}</p>
          </div>
        ))}
      </div>

      {/* Nearby Ranks Section */}
      <Card className="border-none bg-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Ranks near you</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nearbyUsers.map((user, index) => (
              <div
                key={user.name}
                className={`flex items-center rounded-lg p-4 ${
                  index === 0
                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                    : index === 1
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                      : 'bg-gray-700'
                }`}
              >
                <Avatar className="mr-4 h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-300">Rank {user.rank}</p>
                </div>
                <Badge variant="secondary">{user.score}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
