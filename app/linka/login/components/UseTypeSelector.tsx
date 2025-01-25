import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { UserType } from '@/lib/types/userTypes'

interface UserTypeSelectorProps {
  userType: UserType
  onUserTypeChange: (value: UserType) => void
}

export function UserTypeSelector({
  userType,
  onUserTypeChange,
}: UserTypeSelectorProps) {
  return (
    <RadioGroup
      value={userType}
      onValueChange={onUserTypeChange}
      className="flex flex-col sm:flex-row gap-4 mb-4"
    >
      {Object.values(UserType).map((type) => (
        <div
          key={type}
          className={`flex-1 flex items-center space-x-2 rounded-lg border p-2 cursor-pointer hover:border-black ${
            userType === type ? 'bg-gray-100 border-black' : ''
          }`}
        >
          <RadioGroupItem value={type} id={type} className="sr-only" />
          <div
            className={`w-4 h-4 rounded-full border ${userType === type ? 'bg-black border-black' : 'border-gray-300'}`}
          />
          <Label htmlFor={type} className="cursor-pointer flex-grow">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
