import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";


export const icons = {
    index: (props)=> <AntDesign name="home" size={26} {...props} />,
    explore: (props)=> <Feather name="compass" size={26} {...props} />,
    create: (props)=> <MaterialCommunityIcons name="cards-playing-heart-multiple-outline" size={26} {...props} />,
    profile: (props)=> <AntDesign name="user" size={26} {...props} />,
    camera: (props)=> <AntDesign name="scan1" size={26} {...props} />,
}